const mongoose = require('mongoose'),
    Twit = mongoose.model('Twit'),
    User = mongoose.model('User');

let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};



function  userAddNewTwit  (req, res)  {
    console.log(req.headers);
    if (!req.body.title || !req.body.body){
        responseJSON(res, 400, {
            'message': "All fields required."
        });
        return;
    }
    let title = req.body.title;
    console.log(title);
    let newTwit = new Twit();
    newTwit.title = req.body.title;
    newTwit.body = req.body.body;

    newTwit.save((err) => {
        if (err) {
            responseJSON(res, 404, err);
        } else {

        }
    });

    let _idTwit = Twit.findOne({title : title}, function(err, body) {
        if (err) { throw new Error}
        return body
    });

    console.log(_idTwit);
}

module.exports = userAddNewTwit;