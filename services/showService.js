const mongoose = require('mongoose'),
    Twit = mongoose.model('Twit'),
    User = mongoose.model('User');
const verifyToken = require('../utils/verifyToken');

let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};


module.exports.following = function (req, res) {
    let following = [];
    User.findOne({nickname : req.params.nickname}, function(err, document) {
        if (err) {throw new Error}
        document.following.forEach(async function (idFollowing) {

            await User.findOne({ _id : idFollowing }, function(err, doc) {
                if (err) {throw new Error}
                following.push(doc.nickname);
            });
            responseJSON(res, 200, following);
        })
    });
};

module.exports.followers = function (req, res) {
    let followers = [];
    User.findOne({nickname : req.params.nickname},  function(err, document) {
        if (err) {throw new Error}
        document.followers.forEach(async function (idFollowers) {

            await User.findOne({ _id : idFollowers }, function(err, doc) {
                   if (err) {throw new Error}
                   followers.push(doc.nickname);

               });
           responseJSON(res, 200, followers);
       })
    });
};



module.exports.myTwits = function (req, res) {
    let twits = [];
    User.findOne({nickname : req.params.nickname},  function(err, document) {
        if (err) {throw new Error}
        document.twits.forEach(async function (idFollowers) {

            await Twit.findOne({ _id : idFollowers }, function(err, doc) {
                if (err) {throw new Error}
                twits.push({
                    title : doc.title,
                    body : doc.body,
                    data : doc.createdAt,
                    author : doc.author
                });

            });
            responseJSON(res, 200, twits);
        })
    });
};

module.exports.twitsMyFollowing = function (req, res) {
    let user = verifyToken(req.headers.authorization);
    let idTwits = [], twitID = [];
    User.findOne({_id : user._id}, function(err, document) {
        if (err) {throw new Error}
        document.following.forEach(async function (idFollowing) {
            await User.findOne({ _id : idFollowing }, function(err, doc) {
                if (err) {throw new Error}
                    idTwits.push(doc.twits);
            });
            for (let i = 0; i < idTwits.length; i++){
                let ii = idTwits[i];
               for(let j = 0; j < ii.length; j++){
                   twitID.push(ii[j])
               }
            }
            const promise = twitID.map( function (idTwit) {
                return Twit.findOne({_id : idTwit})
                    .then(doc => {
                        return {
                            title : doc.title,
                            body : doc.body,
                            data : doc.createdAt,
                            author : doc.author
                        }
                    })
                    .catch(err => console.error);
            });
            Promise.all(promise).then((t) => responseJSON(res, 200, t))
        })
    });
};