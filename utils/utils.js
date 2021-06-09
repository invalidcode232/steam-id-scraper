const XHR = require("xmlhttprequest");
const fs = require('fs');

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
    get_word_list_from_text: function (filename) {
        let array = fs.readFileSync(filename).toString().split("\n");

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
    }
}