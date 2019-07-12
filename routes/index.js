var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Recommand = require('../model/recommand');
var Movie = require('../model/movie');
var Article = require('../model/article');
var User = require('../model/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/mongoose', (req, res, next) => {
   mongoose.connect('mongodb://localhost/pets');
   mongoose.Promise = global.Promise;

   var Cat = mongoose.model('Cat', {name: String});
   var tom = new Cat({name: 'Tom'});
   tom.save((err) => {
     if (err) {
       console.log(err);
     } else {
       console.log("insert success!");
     }
   })
   res.send("数据库测试连接;");
})

//显示大图
router.get('/showIndex', (req, res, next) => {
  Recommand.findAll((err, docs) => {
    if (err) {
      res.json({status: 1, message: "查询失败", data: err});
    } else {
      res.json({status: 0, message: "查询成功", data: docs});
    }
  })
})
//显示排行榜
router.get('/showRank', (req, res, next) => {
  Movie.find({movieMainPage: true}, (err, docs) => {
    if (err) return res.json({status: 1, message: "查询失败", data: err})
    res.json({status: 0, message: "查询成功", data: docs})
  })
})
//显示文章列表
router.get('/showArticles', (req, res, next) => {
  Article.findAll((err, articles) => {
    res.json({status: 0, message: '返回成功', data: articles});
  })
})

//显示文章详细
router.post('/articleDetail', (req, res, next) => {
  console.log(req.body);
  var info = req.body;

  if (info.article_id) {
    Article.findById(info.article_id, (err, doc) => {
      res.json({status: 0, message: '获取文章成功', data: doc})
    })
  } else {
    res.json({status: 1, message: "查询失败"})

  }
})

//显示用户信息
router.post('/showUser', (req, res, next) => {
  //是否需要验证token
  console.log(req.body);
  var info = req.body;

  if (info._id) {
    User.findById(info._id, (err, doc) => {
      res.json({status: 0, message: '获取用户信息成功', data: doc})
    })
  } else {
    res.json({status: 1, message: "查询失败"})

  }
})

module.exports = router;
