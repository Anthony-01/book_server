var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    userName: String,
    userPwd: String,
    userMail: String,
    userPhone: String,
    userAdmin: Boolean,
    userPower: Number,
    userStop: Boolean
})
//为集合添加静态方法
// userSchema.static. = () => {
//     this.find({}, callBack);
// }

userSchema.statics.findAll = function(callBack) {
    this.find({}, callBack);
}


userSchema.statics.findByName = function(name, callBack)  {
    this.find({userName: name}, callBack);
}


userSchema.statics.findUserLogin = function(name, pwd, callBack)  {
    this.find({userName: name, userPwd: pwd}, callBack);
}
userSchema.statics.findByInfo = function(name, mail, phone, callBack)  {
    this.find({userName: name, userMail: mail, userPhone: phone}, callBack);
}

module.exports = mongoose.model('User', userSchema);