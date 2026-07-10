const { webhookURL, enableDiscordWebhook, outputFile, requestDelayMs } = require("./config.json");

const readline = require('readline-sync');
const fs = require('fs');
const utils = require('./utils/utils');
const chalk = require('chalk');

console.log(chalk.green('      _                         _     _ \r\n     | |                       (_)   | |\r\n  ___| |_ ___  __ _ _ __ ___    _  __| |\r\n \/ __| __\/ _ \\\/ _` | \'_ ` _ \\  | |\/ _` |\r\n \\__ \\ ||  __\/ (_| | | | | | | | | (_| |\r\n |___\/\\__\\___|\\__,_|_| |_| |_| |_|\\__,_|\r\n                                        '));
console.log(chalk.green('                                     \r  ___  ___ _ __ __ _ _ __   ___ _ __ \r\n \/ __|\/ __| \'__\/ _` | \'_ \\ \/ _ \\ \'__|\r\n \\__ \\ (__| | | (_| | |_) |  __\/ |   \r\n |___\/\\___|_|  \\__,_| .__\/ \\___|_|   \r\n                    | |              \r\n                    |_|   \n'));

console.log(`[${chalk.cyan.bold('Created by')}]: invalidcode#1337 // https://steamcommunity.com/id/implements/`);
console.log(`[${chalk.cyan.bold('Edited by')}]: @cqs // https://steamcommunity.com/profiles/76561198787046669/`);
console.log(`[${chalk.cyan.bold('Current Version - Github')}]: https://github.com/coldmorphine/steam-id-scraper\n`);
console.log(`[${chalk.cyan.bold('Old Version - Github')}]: https://github.com/invalidcode232/steam-id-scraper\n\n`);

console.log(chalk.whiteBright("This tool checks Steam profile names (like steamcommunity.com/id/NAME) one by one to find ones that are still free to claim.\n"));

let data_src = 0;
let wordlist = null;
var got_wordlist = false;

console.log(chalk.whiteBright("How should I come up with names to check?\n1. Real words (recommended) - automatically picks random English words\n2. My own list - load names from a .txt file, one name per line\n3. Random gibberish - makes up random letter/number combos\n"));
while (!got_wordlist) {
    data_src = readline.question("[*] Choose an option (1-3): ");

    if (data_src < 1 || data_src > 3 || isNaN(data_src)) {
        console.error(chalk.redBright("[-] Invalid input!\n"))
    } else {
        got_wordlist = true;

        switch (parseInt(data_src)) {
            case 1:
                {
                    let wordlist_count = readline.question("[+] How many names do you want to check? ");
                    console.log("[+] Putting together a word list..");
                    wordlist = utils.get_random_dictionary_words(wordlist_count);
                    console.log("[+] Word list ready!");
                    break;
                }
            case 2:
                {
                    var filename = "";
                    var array = null;

                    while (!array || !array.length || array[0] == '') {
                        let filename = readline.question("[+] Enter word list file name (.txt): ");
                        try {
                            array = fs.readFileSync(filename).toString().split("\n");
                            if (!array.length || array[0] == '') {
                                console.error(chalk.redBright("[*] Empty file\n"));
                            }
                        }
                        catch {
                            console.error(chalk.redBright("[*] Can't open file\n"));
                        }
                    }
                    wordlist = utils.get_word_list_from_text(array);
                    break;
                }
            case 3:
                {
                    let wordlist_count = readline.question("[+] How many names do you want to check? ");
                    while (isNaN(wordlist_count) || wordlist_count < 1) {
                        console.log(chalk.redBright('[-] Invalid number of words'))
                        wordlist_count = readline.question("[+] How many names do you want to check? ");
                    }

                    let wordlist_digit = readline.question("[+] How many characters should each name have? (minimum 3): ");

                    while (isNaN(wordlist_digit) || wordlist_digit < 3) {
                        console.log(chalk.redBright('[-] Invalid digit length'))
                        wordlist_digit = readline.question("[+] How many characters should each name have? (minimum 3): ");
                    }

                    wordlist = utils.get_wordlist_random(wordlist_digit, wordlist_count);
                    break;
                }
            default:
                got_wordlist = false;
                break;
        }
    }
}

console.log('');

const MIN_DELAY_MS = 300;
const configDelayMs = typeof requestDelayMs === 'number' && requestDelayMs >= MIN_DELAY_MS ? requestDelayMs : 1500;

console.log(chalk.yellow.bold("[!] Warning: Steam can temporarily block or rate-limit your IP if you check names too quickly. Checking slower lowers the risk, but doesn't fully remove it - there's no guaranteed-safe speed.\n"));
console.log(chalk.whiteBright(`How fast should I check each name?\n1. Slow (safest, 1 check every 3s)\n2. Normal (recommended, 1 check every ${(configDelayMs / 1000).toFixed(1)}s)\n3. Fast (higher risk of getting blocked, 1 check every 0.5s)\n4. Set my own speed\n`));

let delayMs = null;
while (delayMs === null) {
    const speed_choice = readline.question("[*] Choose an option (1-4): ");

    switch (speed_choice) {
        case '1':
            delayMs = 3000;
            break;
        case '2':
            delayMs = configDelayMs;
            break;
        case '3':
            delayMs = 500;
            break;
        case '4':
            {
                const custom = readline.question(`[+] Delay between checks in milliseconds (minimum ${MIN_DELAY_MS}): `);
                if (isNaN(custom) || parseInt(custom) < MIN_DELAY_MS) {
                    console.log(chalk.redBright(`[-] That's too fast, using the minimum safe delay of ${MIN_DELAY_MS}ms instead.`));
                    delayMs = MIN_DELAY_MS;
                } else {
                    delayMs = parseInt(custom);
                }
                break;
            }
        default:
            console.error(chalk.redBright("[-] Invalid input!\n"));
            break;
    }
}

console.log(chalk.whiteBright(`\n[+] Checking one name every ${(delayMs / 1000).toFixed(1)}s...\n`));

(async () => {
    let log_text = "";

    for (var i = 0; i < wordlist.length; i++) {
        const result = await utils.is_id_available(wordlist[i]);

        if (result === null) {
            console.log(`[!] Skipped '${wordlist[i].toString()}' ${chalk.yellow('(request failed, see error above)')}`);
        }
        else if (result != -1) {
            console.log(`[+] ID '${wordlist[i].toString()}' is ${chalk.green.bold('currently available!')}`);

            if (enableDiscordWebhook) {
                let message = `[+] ID ${wordlist[i].toString()} is currently available!`;
                await utils.send_discord_webhook(message, webhookURL);
            }

            log_text += wordlist[i] + "\n";
        }
        else {
            console.log(`[-] ID '${wordlist[i].toString()}' is ${chalk.red('not available!')}`);
        }

        if (i < wordlist.length - 1) {
            await utils.sleep(delayMs);
        }
    }

    fs.writeFileSync(outputFile, log_text);
})();