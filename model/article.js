var mongoose = require('mongoose');
var articleMovie = new mongoose.Schema({
    articleTitle: String,
    articleContent: String,
    articleTime: String
})
articleMovie.statics.findById = function (id, callBack) {
    this.find({_id: id}, callBack);
}

module.exports = mongoose.model('Article', articleMovie);

