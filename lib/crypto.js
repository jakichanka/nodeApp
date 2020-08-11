const crypto = require('crypto-js');

const cryptoFunc = function(string) {
    this.string = string;

    const self = this;

    this.encrypt = function () {
        return crypto.SHA256(self.string).toString();
    }

}

module.exports = cryptoFunc;