var mongoose = require('mongoose');

var recommandSchema = new mongoose.Schema({
    recommandTitle: String,
    recommandSrc: String,
    recommandImg: String
})

recommandSchema.statics.findAll = function(callBack) {
    this.find({}, callBack);
}
recommandSchema.statics.findById = function(id, callBack) {
    this.find({_id: id}, callBack);
}

module.exports = mongoose.model('Recommand', recommandSchema);