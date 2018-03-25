const mongoose = require('mongoose'),
    Twit = mongoose.model('Twit'),
    User = mongoose.model('User');

const verifyToken = require('../utils/verifyToken');


let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};

module.exports.create = function (req, res)  {
    let user = verifyToken(req.headers.authorization);

    if (!req.body.title || !req.body.body){
        responseJSON(res, 400, {
            'message': "All fields required."
        });
        return;
    }

    let newTwit = new Twit();
    newTwit.title = req.body.title;
    newTwit.body = req.body.body;
    newTwit.author = user._id;

    newTwit.save((err) => {
        if (err) {
            responseJSON(res, 404, err);
        } else {
            responseJSON(res, 200, {
                'message': "Add twit"
            });
        }
    });

    let twit_id = newTwit._id;

    User.update( {_id: user._id},
        {$push: { twits: twit_id}},
        (err, ) => {
        if(err) {
            throw new  Error
        }
    });
};

module.exports.readOne = function (req, res) {
    console.log(req.params.id);
    if (req.params.id === undefined) {
        responseJSON(res, 400, {
            "message": "id is undefined"
        })
    }
    Twit.findById(req.params.id, function(err, twit) {
        if (err) {throw new Error}
        responseJSON(res, 200, twit)
    });
};

module.exports.readAll = function (req, res) {
    Twit.find( function(err, twits) {
        if (err) {throw new Error}
        responseJSON(res, 200, twits)
    });
};

module.exports.update = function (req, res) {
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
           Twit.findOne({_id : req.params.id}, function(err, twit) {
               if (err) {throw new Error}
               if (req.body.title !== undefined) {
                   twit.title = req.body.title
               }
               if (req.body.body !== undefined) {
                   twit.body = req.body.body
               }
               twit.save(function (err) {
                   if (err) {
                       return res.status(500).send(err.message)
                   } else {
                       return responseJSON(res, 200, twit)
                   }
               })
           })

       }
    });



};


module.exports.delete = function (req, res) {
    let user = verifyToken(req.headers.authorization);
    if (req.params.id === undefined) {
        responseJSON(res, 400, {
            "message": "id  undefined"
        })
    }

    User.findOne({_id: user._id}, function (err, user) {
        if (err) {
            throw new Error
        }

        if (user.twits.indexOf(req.params.id) === -1) {
            responseJSON(res, 400, {
                "message": "This is not your twit"
            })
        } else {
            Twit.findOne({_id: req.params.id}, function (err, user) {
                if (err) {
                    return res.status(500).send(err.message)
                }
                user.remove(function (err) {
                    if (err) {
                        return res.send(500, err.message)
                    } else {
                        res.status(200).send(`Twit delete`)
                    }
                });
            });
        }
    });
};

