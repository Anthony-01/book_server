var mongoose = require('mongoose');
var serviceUrl = "mongodb://localhost/movieServer";
mongoose.connect(serviceUrl);

module.exports = mongoose;