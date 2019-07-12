var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
    movie_id: String,
    userName: String,
    comment: String,
    check: Boolean
})

commentSchema.statics.findAll = function(callBack) {
    this.find({}, callBack);
}

commentSchema.statics.findByMovieId = function(id, callBack) {
    this.find({movie_id: id}, callBack);
}

module.exports = mongoose.model('Comment', commentSchema);