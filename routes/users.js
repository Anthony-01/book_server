var express = require('express');
var router = express.Router();
var User = require('../model/user');
var Comment = require('../model/comment');
var Movie = require('../model/movie');
var Mail = require('../model/mail');
// var Movie = require()



var getMD5Password = require('../utils/md5');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//注册
router.post('/register', (req, res, next) => {
  console.log(req.body);
  // res.json({status: 1, message: "已存在用户名"});
  // return;
  User.findByName(req.body.username, (err, userSave) => {
    if (userSave.length != 0) {
      res.json({status: 1, message: "已存在用户名"});
    } else {
      var user = new User({
        userName: req.body.username,
        userPwd: req.body.password,
        userMail: req.body.mail,
        userPhone: req.body.phone,
        userAdmin: false,
        userPower: 0,
        userStop: false
      })
      user.save((err) => {
        if (err) {
          res.json(err);
        } else {
          res.json({status: 0, message: "注册成功"})
        }
      })
    }
    
  })
})
//登录
router.post('/login', (req, res, next) => {
  //body中包含username以及passward
  console.log(req.body);
  let info = req.body;
  User.findUserLogin(info.username, info.password, (err, docs) =>{
    if (docs.length != 0) {
      let token = getMD5Password(docs[0]._id);
      res.json({status: 0, message: "登陆成功", data: {token: token, user: docs}});
    } else {
      console.log(err);
      res.json({status: 1, message: "登录失败,用户名或密码错误!"})
    }
  })
})
//提交评论
router.post('/postComment', (req, res, next) => {
  console.log(req.body);
  var info = req.body;
  var username = info.username || "匿名用户";
  var comment = new Comment({
    movie_id: info.id,
    userName: username,
    comment: info.comment,
    check: false
  })
  comment.save((err) => {
    if (err) {
      res.json({status: 1, message: "评论失败", data: err});
    } else {
      res.json({status: 0, message: "评论成功"});
    }
  })
  
})
//点赞
router.post('/support', (req, res, next) => {
  console.log(req.body);
  // console.log(`点赞路由: ${req.body}`);
  var info = req.body;
  Movie.findOne({_id: info.movie_id}, (err,doc) => {
    if (err) {
      res.json({status: 1, message: "点赞失败", data: err});
    } else {
      if (!doc) {
        res.json({status: 1, message: "未找到该电影"});
      } else {
        doc.movieNumSuppose += 1;
        doc.save((err) => {
          if (err) {
            res.json({status: 1, message: "点赞失败", data: err});
          } else {
            res.json({status: 0, message: "点赞成功"});
          }
        })
      }
    }
  })
})
//找回密码
router.post('/findPwd', (req, res, next) => {
  //是否repassword
  let info = req.body;
  console.log(info);
  if (info.repassword) {
    //是否登录状态
    if (info.token) {
      //直接修改密码,验证登录状态
      if (info.token == getMD5Password(info._id)) {
        User.findOne({userName: info.username, userMail: info.mail, userPhone: info.phone, userPwd: info.password}, (err, doc) => {
          if (err) {
            res.json({status: 1, message: "登录错误", data: err});
          } else {
            if (doc) {
              doc.userPwd = info.repassword;
              doc.save((err, msg) => {
                if (err) return res.json({status: 1, message: "修改错误", data: err});
                return res.json({status: 0, message: "修改成功", data: msg});
              })
            } else {
              res.json({status: 1, message: "用户信息错误"})
            }
            
          }
        })
      } else { //token不正确的情况
        res.json({status: 1, message: "用户登录错误"});
      }
    } else { //不存在token，直接验证邮箱
      User.findOne({userName: info.username, userMail: info.mail, userPhone: info.phone}, (err, doc) => {
        if (err) return res.json({status: 1, message: "信息错误", data: err});
        doc.userPwd = info.repassword;
        doc.save((err, update) => {
          if (err) return res.json({status: 1, message: "修改失败", data: err});
          return res.json({status: 0, message: "修改成功", data: update});
        })
      })
    }
  } else {
    //没有新密码，单纯验证是否能修改
    User.findOne({userName: info.username, userMail: info.userMail, userPhone: userphone}, (err, doc) => {
      if (err) return res.json({status: 1, message: "信息错误", data: err});
      // doc.userPwd = info.repassword;
      // doc.save((err, update) => {
      //   if (err) return res.json({status: 1, message: "修改失败", data: err});
      //   return res.json({status: 0, message: "修改成功", data: update});
      // })
      res.json({status: 0, message: "验证成功,请修改密码!"});
    })

  }
})
//发送站内信
router.post('/postMail', (req, res, next) => {
  console.log("站内信:");
  console.log(req.body);
  var info = req.body;
  if (info.token != getMD5Password(info._id)) {
    res.json({status: 1, message: "身份验证失败"});
    return;
  }
  //from_id:
  var mail = new Mail({
    fromUser: info.from_id,
    toUser: info.to_id,
    title: info.title,
    content: info.content
  })
  mail.save((err) => {
    if (err) {
      res.json({status: 1, message: "发送失败", data: err});
    } else {
      res.json({status: 0, message: "发送成功"});
    }
  })
})
//显示站内信
router.post('/showMail', (req, res, next) => {
  console.log("显示站内信:");
  console.log(req.body);
  var info = req.body;
  if (info.token != getMD5Password(info._id)) {
    res.json({status: 1, message: "身份验证失败"});
    return;
  }
  if (info.receive == 1) {
    //显示发送的站内信
    Mail.findByFrom(info._id, (err, docs) => {
      if (docs.length != 0) {
        res.json({status: 0, message: "返回发送信", data: docs});
      } else {
        res.json({status: 1, message: "查找失败", data: err});
      }
    })
  }
})

//下载路由,返回下载的地址
router.post('/download', (req, res, next) => {
  console.log(req.body);
  var info = req.body;
  Movie.findOne({_id: info.movie_id}, (err, doc) => {
    if (err) {
      res.json({status: 1, message: "下载失败", data: err});
    } else {
      if (doc) {
        doc.movieNumDownload += 1;
        res.json({status: 0, message: "获得链接地址", data: doc.movieDownload});
      } else {
        res.json({status: 1, message: "未找到电影:" + info.movie_id});
      }
    }
  })
})

// function getMD5Password(id) {
//   let md5 = crypto.createHash('md5');
//   var token_before = id + init_token;
//   return md5.update(token_before).digest('hex');
// }



module.exports = router;
