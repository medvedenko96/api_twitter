const mongoose = require('mongoose'),
    Twit = mongoose.model('Twit'),
    User = mongoose.model('User'),
    Comment = mongoose.model('Comment');

const verifyToken = require('../utils/verifyToken');

let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};

module.exports.create = function (req, res) {
    let user = verifyToken(req.headers.authorization);

    if (req.params.id === undefined) {
        responseJSON(res, 400, {
            "message": "id  undefined"
        })
    }
    User.findOne({_id : user._id}, function (err, user) {
        if (err) {throw new Error}
        if (user.twits.indexOf(req.params.id) === -1) {
            responseJSON(res, 400, {
                "message": "This is not your twit"
            })
        } else {
            let newComment = new Comment();
            newComment.body = req.body.body;
            newComment.author = user._id;
            newComment.save((err) => {
                if (err) {
                    responseJSON(res, 404, err);
                } else {
                    /*Twit.findOne({_id : req.params.id}, function(err, twit) {
                        if (err) {throw new Error}
                        twit.comment.push(newComment._id);
                        twit.save(function (err) {
                            if (err){
                                return res.status(500).send(err.message)
                            }
                        });
                    });*/
                    Twit.update( {_id: req.params.id},
                        {$push: {comment : newComment._id}},
                        (err) => {
                            if(err) {
                                throw new  Error
                            }
                        });
                    responseJSON(res, 200, {
                        'message': "Add comment"
                    });
                }
            });
        }
    });
};

module.exports.readOne = function (req, res) {

    if (req.params.id === undefined) {
        responseJSON(res, 400, {
            "message": "id  undefined"
        })
    }
    Comment.findOne({_id : req.params.id}, function (err, comment) {
        if (err) {
            responseJSON(res, 404,{
                'message': "Comment is undefined"
            });
            throw new Error
        }
        responseJSON(res, 200, comment)
    })
};

module.exports.readAll = function (req, res) {
    let comments = [];
    if (req.params.id === undefined) {
        responseJSON(res, 400, {
            "message": "id  undefined"
        })
    }
    Twit.findOne({_id : req.params.id}, function (err, twit) {
        if (err) {
            responseJSON(res, 404,{
                'message': "Twit is undefined"
            });
            throw new Error
        }
        twit.comment.forEach( async function (item) {
            await Comment.findById(item, function (err, comment) {
                comments.push(comment);
            });
            responseJSON(res, 200, comments)
        });

    })
};

module.exports.update = function (req, res) {
    let user = verifyToken(req.headers.authorization);

    if (req.params.id === undefined) {
        responseJSON(res, 400, {
            "message": "id  undefined"
        })
    }
           Comment.findOne({_id : req.params.id}, function (err, comment) {
                if (!comment){
                    res.send(404, 'not found');
                }
                if (comment.author.toString() !== user._id){
                    responseJSON(res, 404,{
                        "message": "This is not your comment"
                    });
                }
                if (err) {
                    throw new Error}
                if (req.body.body !== undefined) {
                    comment.body = req.body.body
                }
                comment.save(function (err) {
                    if (err) {
                        return res.status(500).send(err.message)
                    } else {
                        return responseJSON(res, 200, comment)
                    }
                })
            })
};


module.exports.delete = function (req, res) {
    let user = verifyToken(req.headers.authorization);

    if (req.params.id === undefined) {
        responseJSON(res, 400, {
            "message": "id  undefined"
        })
    }
    Comment.findOne({_id : req.params.id},  function (err, comment) {
        if (err) {
            throw new Error
        }
        if (comment === undefined) {
            res.send(404, 'not found');
        }
        if (comment.author.toString() !== user._id) {
            responseJSON(res, 404, {
                "message": "This is not your comment"
            });
        }
        comment.remove(function (err) {
            if (err) {
                return res.send(500, err.message)
            } else {
                res.status(200).send(`Comment delete`)
            }
        });
    })
};