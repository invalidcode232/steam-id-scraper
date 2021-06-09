# steam-id-scraper
 Steam custom URL scraper made with Node.js
 
![Preview](https://cdn.discordapp.com/attachments/706129504682246146/852128734336385044/ss.png)

### Word list sources
Steam ID Scraper supports 3 word sources
 - Random english words (Using (Random word API)[https://random-word-api.herokuapp.com/])
 - Random string with customizable letter count
 - Custom wordlist file

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
Steam IDs that have not been used will be stored to `output.txt`
