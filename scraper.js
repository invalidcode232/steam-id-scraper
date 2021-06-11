const { webhookURL, enableDiscordWebhook, outputFile } = require("./config.json");

const readline = require('readline-sync');
const fs = require('fs');
const utils = require('./utils/utils');
const chalk = require('chalk');

console.log(chalk.green('      _                         _     _ \r\n     | |                       (_)   | |\r\n  ___| |_ ___  __ _ _ __ ___    _  __| |\r\n \/ __| __\/ _ \\\/ _` | \'_ ` _ \\  | |\/ _` |\r\n \\__ \\ ||  __\/ (_| | | | | | | | | (_| |\r\n |___\/\\__\\___|\\__,_|_| |_| |_| |_|\\__,_|\r\n                                        '));
console.log(chalk.green('                                     \r  ___  ___ _ __ __ _ _ __   ___ _ __ \r\n \/ __|\/ __| \'__\/ _` | \'_ \\ \/ _ \\ \'__|\r\n \\__ \\ (__| | | (_| | |_) |  __\/ |   \r\n |___\/\\___|_|  \\__,_| .__\/ \\___|_|   \r\n                    | |              \r\n                    |_|   \n'));

console.log(`[${chalk.cyan.bold('Made by')}]: invalidcode#1337 // https://steamcommunity.com/id/implements/`);
console.log(`[${chalk.cyan.bold('Github')}]: https://github.com/invalidcode232/steam-id-scraper\n\n`);

let data_src = 0;
let wordlist = null;
var got_wordlist = false;

console.log(chalk.whiteBright("1. Automatically generated\n2. Custom wordlist file\n3. Random Word Generator\n"));
while (!got_wordlist) {
    data_src = readline.question("[*] Enter dictionary source (1 - 3): ");

    if (data_src < 1 || data_src > 3 || isNaN(data_src)) {
        console.error(chalk.redBright("[-] Invalid input!\n"))
    } else {
        got_wordlist = true;

        switch (parseInt(data_src)) {
            case 1:
                {
                    let wordlist_count = readline.question("[+] Enter the number of words to scrape: ");
                    console.log("[+] Getting word list..");
                    wordlist = utils.get_word_list_from_web(wordlist_count);
                    console.log("[+] Word list received!");
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
                    let wordlist_count = readline.question("[+] Enter the number of words to generate: ");
                    while (isNaN(wordlist_count) || wordlist_count < 1) {
                        console.log(chalk.redBright('[-] Invalid number of words'))
                        wordlist_count = readline.question("[+] Enter the number of words to generate: ");
                    }

                    let wordlist_digit = readline.question("[+] Enter the digits of words to generate: ");

                    while (isNaN(wordlist_digit) || wordlist_digit < 3) {
                        console.log(chalk.redBright('[-] Invalid digit length'))
                        wordlist_digit = readline.question("[+] Enter the digits of words to generate: ");
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

let log_text = "";
for (var i = 0; i < wordlist.length; i++) {
    if (utils.is_id_available(wordlist[i]) != -1){
        console.log(`[+] ID '${wordlist[i].toString()}' is ${chalk.green.bold('currently available!')}`);

        if (enableDiscordWebhook) {
            let message = `[+] ID ${wordlist[i].toString()} is currently available!`;
            utils.send_discord_webhook(message, webhookURL);            
        }

        log_text += wordlist[i] + "\n";
    }
    else {
        console.log(`[-] ID '${wordlist[i].toString()}' is ${chalk.red('not available!')}`);
    }
}

fs.writeFileSync(outputFile, log_text);