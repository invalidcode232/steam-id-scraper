const XHR = require("xmlhttprequest");
const fs = require('fs');

function gen_random_string(length) {
    var result           = '';
    var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   
   return result;
}

module.exports = {
    get_word_list_from_web: function (count) {
        const request = new XHR.XMLHttpRequest();
        request.open('GET', `https://random-word-api.herokuapp.com/word?number=${count}`, false);
        request.send(null);

        if (request.status === 200)
            return JSON.parse(request.responseText);
        else
            console.error("[-] An unknown error occured.");
    },
    get_word_list_from_text: function (array) {
        let wordlist = [];
        for (var i = 0; i < array.length; i++) {
            wordlist[i] = array[i].replace(/(\r\n|\n|\r)/gm, "")
        }

        return wordlist;
    },
    is_id_available: function (id) {
        const request = new XHR.XMLHttpRequest();
        request.open('GET', `https://steamcommunity.com/id/${id}`, false);
        request.send(null);

        if (request.status === 200){
            const string = request.responseText;
            const is_exists = string.search("The specified profile could not be found.");

            return is_exists;
        }
        else
            console.error("[-] An unknown error occured.");
    },
    get_wordlist_random: function(letters, count) {
        let wordlist = [];

        for (var i = 0; i < count; i++) {
            wordlist.push(gen_random_string(letters));
        }

        return wordlist;
    },
    send_discord_webhook: function (message, url) {
        const request = new XHR.XMLHttpRequest();
        request.open("POST", url, false);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        let data = {
            "content": message,
        }

        const json = JSON.stringify(data);

        request.send(json);
    }
}