const crypto = require('crypto-js');

const cryptoFunc = (string) => {
    return {
        encrypt() {
            return crypto.SHA256(string).toString();
        }
    }
}


module.exports = cryptoFunc;