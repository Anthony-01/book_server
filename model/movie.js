var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    movieName: String,
    movieImg: String,
    movieDownload: String,
    movieVideo: String,
    movieNumSuppose: Number,
    movieTime: String,
    movieNumDownload: Number,
    movieMainPage: Boolean
})

module.exports = mongoose.model('Movie', movieSchema);