const mongoose = require('mongoose');
const User = mongoose.model('User');

function profile(req, res) {
    User.findOne({nickname : req.params.nickname}, function(err, document) {
        if (err) {throw new Error}

        res.json(document)

    });

}

module.exports = profile;