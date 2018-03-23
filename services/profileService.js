const mongoose = require('mongoose');
const User = mongoose.model('User');

let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};
const verifyToken = require('../utils/verifyToken');

module.exports.readOne = function (req, res) {
    if (req.params.nickname === undefined) {
        responseJSON(res, 400, {
            "message": "Nickname is undefined"
        })
    }
    User.findOne({nickname : req.params.nickname}, function(err, document) {
        if (err) {throw new Error}
            responseJSON(res, 200, document)
    });
};

module.exports.readAll = function (req, res) {
    User.find( function(err, document) {
        if (err) {throw new Error}
            responseJSON(res, 200, document)
    });
};

module.exports.update = function (req, res) {
    let user = verifyToken(req.headers.authorization);

    if (req.params.nickname === undefined) {
        responseJSON(res, 400, {
            "message": "Nickname is undefined"
        })
    }

    User.findOne({_id : user._id}, function(err, user) {
        if (err) {throw new Error}
        if (req.body.nickname !== undefined) {
            user.nickname = req.body.nickname
        }
        if (req.body.firstname !== undefined) {
            user.firstname = req.body.firstname
        }
        if (req.body.lastname !== undefined) {
            user.lastname = req.body.lastname
        }
        if (req.body.email !== undefined) {
            user.email = req.body.email
        }
        if (req.body.about !== undefined) {
            user.about = req.body.about
        }
        if (req.body.password !== undefined) {
            user.salt = '';
            user.hash = '';
            user.setPassword(req.body.password);
        }
        user.save(function (err) {
            if (err){
                return res.status(500).send(err.message)
            } else {
                return responseJSON(res, 200, user)
            }
        });
    });
};

module.exports.delete = function (req, res) {
    let user = verifyToken(req.headers.authorization);

    if (req.params.nickname === undefined) {
        responseJSON(res, 400, {
            "message": "Nickname is undefined"
        })
    }
    User.findOne({_id : user._id}, function(err, user) {
        if (err) {
            return res.status(500).send(err.message)
        }
        user.remove(function (err) {
            if (err) {
                return res.send(500, err.message)
            } else {
                res.status(200).send(`User delete`)
            }
        });
    });
};