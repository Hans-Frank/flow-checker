const langs =  require('./languages.json')

module.exports.getTranslation = (code) => {
    let lang =  langs.find(l => l.code.toLowerCase() == code.toLowerCase())

    if(lang == undefined) {
        return langs.find(l => l.code == 'en_us')
    } else {
        return lang;
    }
}