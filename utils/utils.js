const fs = require('fs');
// word-list is ESM-only; requiring it from CommonJS yields the module namespace
// object, so the file path is under `.default` rather than the export itself.
const wordListPath = require('word-list').default;

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;
const REQUEST_TIMEOUT_MS = 10000;

function gen_random_string(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }

   return result;
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Retries on network errors and backs off (honoring Retry-After when Steam sends
// a 429/403, since that's how Steam signals rate-limiting/blocking) before giving up.
async function fetch_with_retry(url, options = {}) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        let response;
        try {
            response = await fetch(url, {
                ...options,
                headers: { 'User-Agent': USER_AGENT, ...(options.headers || {}) },
                signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            });
        } catch (err) {
            if (attempt === MAX_RETRIES) throw err;
            await sleep(BASE_BACKOFF_MS * 2 ** attempt);
            continue;
        }

        if (response.status === 429 || response.status === 403) {
            if (attempt === MAX_RETRIES) return response;

            const retryAfterHeader = response.headers.get('retry-after');
            const waitMs = retryAfterHeader
                ? parseInt(retryAfterHeader, 10) * 1000
                : BASE_BACKOFF_MS * 2 ** attempt;

            console.error(`[!] Steam responded with ${response.status}, backing off for ${Math.round(waitMs / 1000)}s...`);
            await sleep(waitMs);
            continue;
        }

        return response;
    }
}

module.exports = {
    get_random_dictionary_words: function (count) {
        count = parseInt(count, 10);
        const words = fs.readFileSync(wordListPath, 'utf8').split('\n').filter(Boolean);
        const wordlist = [];

        for (let i = 0; i < count; i++) {
            wordlist.push(words[Math.floor(Math.random() * words.length)]);
        }

        return wordlist;
    },
    get_word_list_from_text: function (array) {
        let wordlist = [];
        for (var i = 0; i < array.length; i++) {
            wordlist[i] = array[i].replace(/(\r\n|\n|\r)/gm, "")
        }

        return wordlist;
    },
    // Returns the search-index result (see caller), or null if the check couldn't
    // be completed (network failure or an unexpected/blocked response from Steam).
    is_id_available: async function (id) {
        let response;
        try {
            response = await fetch_with_retry(`https://steamcommunity.com/id/${id}`);
        } catch (err) {
            console.error(`[-] Failed to check '${id}': ${err.message}`);
            return null;
        }

        if (response.status === 200) {
            const string = await response.text();
            return string.search("The specified profile could not be found.");
        }

        console.error(`[-] Unexpected status code ${response.status} while checking '${id}'`);
        return null;
    },
    get_wordlist_random: function(letters, count) {
        let wordlist = [];

        for (var i = 0; i < count; i++) {
            wordlist.push(gen_random_string(letters));
        }

        return wordlist;
    },
    send_discord_webhook: async function (message, url) {
        try {
            await fetch_with_retry(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json;charset=UTF-8' },
                body: JSON.stringify({ 'content': message }),
            });
        } catch (err) {
            console.error(`[-] Failed to send Discord webhook: ${err.message}`);
        }
    },
    sleep: sleep,
}
