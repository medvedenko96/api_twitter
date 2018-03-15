const mongoose = require('mongoose'),
    Twit = mongoose.model('Twit'),
    User = mongoose.model('User');

const verifyToken = require('../utils/verifyToken');


let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};

function  addNewTwit  (req, res)  {
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

  /*  User.findByIdAndUpdate(user._id,
        {$push: {twits: twit_id}},
        {safe: true, upsert: true},
        function(err, doc) {
            if(err){
                console.log(err);
            }else{
                //do stuff
            }
        }
    );*/

    /*User.findOne({_id : user._id}, function (err, user) {
        if (err) {throw new Error}
        console.log(user.twits);
    });*/




}

module.exports = addNewTwit;

