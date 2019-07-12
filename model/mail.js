//站内信
var mongoose = require('mongoose');

var mailSchema = new mongoose.Schema({
    fromUser: String,
    toUser: String,
    title: String,
    content: String
})

mailSchema.statics.findByFrom = function(id, callBack) {
    this.find({fromUser: id}, callBack);
}
mailSchema.static.findByTo = function(id, callBack) {
    this.find({toUser: id}, callBack);
}

module.exports = mongoose.model('Mail', mailSchema);