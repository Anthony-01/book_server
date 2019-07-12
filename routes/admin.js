var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var getMD5Password = require('../utils/md5');
var User = require('../model/user');
var Movie = require('../model/movie');
var Comment = require('../model/comment');
var Article = require('../model/article');
var Recommand = require('../model/recommand');

router.use((req, res, next) => {
    var info = req.body;
    checkAdminPower(info.username, info.token, info._id).then((check) => {
        if (check.err == 0 && check.stop == false) {
            next();
        } else {
            res.json({status: 1, message: "你不是管理员或者已经封停"});
        }
    })
})

router.post('/addMovie', (req, res, next) => {
    // //首先验证身份
    var info = req.body;
    console.log(info);
    
    let movie = new Movie({
        movieName: info.movie_name,
        movieImg: info.movie_image,
        movieDownload: info.movie_download,
        movieVideo: info.movie_video,
        movieNumSuppose: 0,
        movieTime: Date.now(),
        movieNumDownload: 0,
        movieMainPage: info.main_page || false
    }) 
    movie.save((err) => {
        if (err) {
            res.json({status: 1, message: "保存失败", data: err})
        } else {
            res.json({status: 0, message: "保存成功"})
        }
    })
        
})

router.post('/delMovie', (req, res, next) => {
    console.log(req.body);
    var info = req.body;
    
    Movie.remove({_id: info.movie_id}, (err, del) => {
        if (err) {
            res.json({status: 1, message: "错误", data: err});
        } else {
            res.json({status: 0, message: "删除成功", data: del});
        }
    })
    
})

function checkAdminPower(name, token, id) {
    return new Promise((resolve, reject) => {
        let err = 1;
        let stop = false;
        if (token == getMD5Password(id)) {
            User.findById(id, (err, doc) => {
                console.log(doc);
                if (doc.userAdmin) {
                    err = 0;
                    stop = doc.userStop;
                }
                resolve({
                    err: err,
                    stop: stop
                })
            })
        } else {
            resolve({
                err: err,
                stop: stop
            })
        }
    })
    //验证用户的token是否一致
} 

router.post('/updateMovie', (req, res, next) => {
    var info = req.body;
    // let movieInfo = info.movieInfo;
    let saveData = info.movieInfo;

    Movie.update({_id: info.movie_id}, saveData, (err, update) => {
        if (update) {
            res.json({status: 0, message: "修改成功", data: update})
        } else {
            res.json({status: 1, message: "修改错误", data: err})
        }
    })
    
})

router.get('/movie', (req, res, next) => {
    Movie.findAll((err, docs) => {
        res.json({status: 0, message: "获取成功", data: docs})
    })
})

router.get('/commentList', (req, res, next) => {
    Comment.findAll((err, docs) => {
        if (err) {
            res.json({status:1, message: "获取评论失败", data: err})
        } else {
            res.json({status:0, message: "获取所有评论成功", data: docs});
        }
    })
})

//审核评论
router.post('/checkComment', (req, res, next) => {
    //评论ID
    console.log("审核评论ID");
    var info = req.body;
    Comment.update({_id: info.comment_id}, {check: true}, (err, doc) => {
        if (err) {
            res.json({status:1, message: "审核评论失败", data: err})
        } else {
            res.json({status:0, message: "审核评论成功", data: doc});
        }
    })
})

router.post('/delComment', (req, res, next) => {
    //评论ID
    console.log("删除评论ID");
    var info = req.body;
    Comment.remove({_id: info.comment_id}, (err, doc) => {
        if (err) {
            res.json({status:1, message: "删除评论失败", data: err})
        } else {
            res.json({status:0, message: "删除评论成功", data: doc});
        }
    })
})

//封停用户
router.post('/stopUser', (req, res, next) => {
    var info = req.body;
    console.log(info);
    //只能封停非管理员用户
    User.findOne({_id: info.stop_id}, (err, doc) => {
        if (doc) {
            if (doc.userAdmin == false) {
                doc.userStop = true;
                doc.save((errSave) => {
                    if (errSave) {
                        res.json({status: 1, message: "封停错误", data: err});
                    } else {
                        res.json({status: 0, message: "封停成功"});
                    }
                })
            } else {
                res.json({status: 1, message: "不能删除管理员"});
            }
        } else {
            res.json({status: 1, message: "未找到用户", data: err});
        }
    })
})

//显示所有用户
router.post('/showUser', (req, res, next) => {
    User.findAll((err, docs) => {
        if (err) {
            res.json({status: 1, message: "查询错误", data: err});
        } else {
            res.json({status: 0, message: "查询成功", data: docs});
        }
    })
})

//新增文章
router.post('/addArticle', (req, res, next) => {
    var info = req.body;
    console.log(info);
    var article = new Article({
        articleTitle: info.article_title,
        articleContent: info.article_content,
        articleTime: Date.now()
    })
    article.save((err, docs) => {
        if (err) {
            res.json({status: 1, message: "增加文章失败", data: err});
        } else {
            res.json({status: 0, message: "增加文章成功", data: docs});
        }
    })
})

//删除文章
router.post('/delArticle', (req, res, next) => {
    var info = req.body;
    console.log(info);
    Article.findOne({_id: info.article_id}, (err, docs) => {
        if (err) {
            res.json({status: 1, message: "删除文章失败", data: err});
        } else {
            res.json({status: 0, message: "删除文章成功", data: docs});
        }
    })
    
})

//新增推荐
router.post('/addRecommand', (req, res, next) => {
    var info = req.body;
    console.log(info);
    var recommand = new Recommand({
        recommandTitle: info.recommand_title,
        recommandSrc: info.recommand_src,
        recommandImg: info.recommand_img
    })
    recommand.save((err, docs) => {
        if (err) {
            res.json({status: 1, message: "增加推荐失败", data: err});
        } else {
            res.json({status: 0, message: "增加推荐成功", data: docs});
        }
    })
})

//删除文章
router.post('/delRecommand', (req, res, next) => {
    var info = req.body;
    console.log(info);
    Recommand.findOne({_id: info.recommand_id}, (err, docs) => {
        if (err) {
            res.json({status: 1, message: "删除推荐失败", data: err});
        } else {
            res.json({status: 0, message: "删除推荐成功", data: docs});
        }
    })
    
})



module.exports = router;