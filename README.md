# steam-id-scraper
 Steam custom URL scraper made with Node.js
 
![Preview](https://cdn.discordapp.com/attachments/783498352355966986/1525000313952665621/image.png?ex=6a51cab7&is=6a507937&hm=d42909fef14490b77693a59d054d9c1408c5ef62d7d6eb5bcf10b54fcdd79df8&)

### Word list sources
Steam ID Scraper supports 3 word sources
 - Random english words, picked locally from a bundled [word list](https://github.com/sindresorhus/word-list) (no network call, so it can't go down or get rate-limited)
 - Random string with customizable letter count
 - Custom wordlist file

### Discord Webhook integration
Steam ID scraper can output results to a Discord Webhook. 

**Enabling Webhook**  
In `config.json`, set `enableDiscordWebhook` to `true` and specify `webhookURL` to a Discord Webhook link.

### Rate limiting
Steam can temporarily block or rate-limit an IP that checks names too quickly, and the scraper now warns about this and asks how fast to go before it starts (Slow/Normal/Fast presets, or a custom delay - custom delays are floored at 300ms so you can't accidentally hammer Steam). The "Normal" preset comes from `requestDelayMs` in `config.json` (default `1500`ms). On top of that, checks automatically retry with backoff if Steam responds with a blocking/rate-limit status (429/403), honoring `Retry-After` when present. Checks that fail after retrying are skipped rather than being logged as available/unavailable.

### Usage
Before using, make sure you have [Node.js](https://nodejs.org/) installed.  

**Installing dependencies**
```
npm install
```
**Running the script**
```
node scraper.js
```

**Output**  
Steam IDs that have not been used will be stored to `output.txt` (Output file name is changeable in `config.json`)
