const readline = require('readline-sync');
const fs = require('fs');
const utils = require('./utils/utils');
const chalk = require('chalk');

console.log(chalk.green('      _                         _     _ \r\n     | |                       (_)   | |\r\n  ___| |_ ___  __ _ _ __ ___    _  __| |\r\n \/ __| __\/ _ \\\/ _` | \'_ ` _ \\  | |\/ _` |\r\n \\__ \\ ||  __\/ (_| | | | | | | | | (_| |\r\n |___\/\\__\\___|\\__,_|_| |_| |_| |_|\\__,_|\r\n                                        '));
console.log(chalk.green('                                     \r  ___  ___ _ __ __ _ _ __   ___ _ __ \r\n \/ __|\/ __| \'__\/ _` | \'_ \\ \/ _ \\ \'__|\r\n \\__ \\ (__| | | (_| | |_) |  __\/ |   \r\n |___\/\\___|_|  \\__,_| .__\/ \\___|_|   \r\n                    | |              \r\n                    |_|   \n'));

console.log(`[${chalk.cyan.bold('Made by')}]: invalidcode#1337 // https://steamcommunity.com/id/implements/`);
console.log(`[${chalk.cyan.bold('Github')}]: https://github.com/invalidcode232/steam-id-scraper\n\n`);

let data_src = readline.question("[+] Enter dictionary source (1: Random english words, 2: Random string, 3: Custom wordlist txt): ");

console.log("\n");

let wordlist = null;

if (data_src == 1) {
    let wordlist_count = readline.question("[+] Enter the number of words to scrape: ");

    console.log("[+] Getting word list..");

    wordlist = utils.get_word_list_from_web(wordlist_count);

    console.log("[+] Word list received!");
}
else if (data_src == 2) {
    let letters = readline.question("[+] Enter number of letters: ");
    let wordlist_count = readline.question("[+] Enter the number of words to scrape: ");

    wordlist = utils.get_wordlist_random(letters, wordlist_count);
}
else if (data_src == 3) {
    let filename = readline.question("[+] Enter word list file name (.txt): ");

    wordlist = utils.get_word_list_from_text(filename);
}
else {
    console.error("[-] Invalid input!")
}

console.log("\n");

let log_text = "";
for (var i = 0; i < wordlist.length; i++) {
    if (utils.is_id_available(wordlist[i]) != -1){
        console.log(`[+] ID '${wordlist[i].toString()}' is ${chalk.green.bold('currently available!')}`);
        log_text += wordlist[i] + "\n";
    }
    else {
        console.log(`[-] ID '${wordlist[i].toString()}' is ${chalk.red('not available!')}`);
    }
}

fs.writeFileSync("output.txt", log_text);