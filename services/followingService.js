const mongoose = require('mongoose'),
    Twit = mongoose.model('Twit'),
    User = mongoose.model('User');

const verifyToken = require('../utils/verifyToken');

module.exports.subscribe = function (req, res) {
    let userDocument = verifyToken(req.headers.authorization);
    // req.params.nickname this is a following
     User.findOne( { nickname : req.params.nickname }, function( err, document ) {
        if ( err ) { throw  new Error }
        // добавляємо нам ід в following
            User.update( {_id: userDocument._id},
                 {$addToSet: {following : document._id}},
                 (err) => {
                     if(err) {
                         throw new  Error
                     }
                 });
        // цьому following добавляємо наш ід в followers
             User.update( { nickname : req.params.nickname },
                 {$addToSet: {followers : userDocument._id } },
                 (err) => {
                     if(err) {
                         throw new  Error
                     }
                     res.send('ok');
                 });

    });
};

module.exports.unsubscribe = function (req, res) {
    let userDocument = verifyToken(req.headers.authorization);

    User.findOne( { nickname : req.params.nickname }, function( err, document ) {
        if ( err ) { throw  new Error }
        User.update( {_id: userDocument._id},
            {$pull: {following : document._id}},
            (err) => {
                if(err) {
                    throw new  Error
                }
            });

        User.update( { nickname : req.params.nickname },
            {$pull: {followers : userDocument._id } },
            (err) => {
                if(err) {
                    throw new  Error
                }
                res.send('ok');
            });

    });


};