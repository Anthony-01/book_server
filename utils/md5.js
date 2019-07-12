var crypto = require('crypto');

var init_token = "handsomehq";

function getMD5Password(id) {
    let md5 = crypto.createHash('md5');
    var token_before = id + init_token;
    return md5.update(token_before).digest('hex');
  }

module.exports = getMD5Password;