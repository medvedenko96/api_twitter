const passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');
require('./passport');

let responseJSON = function(res, status, content) {
    res.status(status);
    res.json(content);
};

function login (req, res) {
    if (!req.body.email || !req.body.password) {
        responseJSON(res, 400, {
            "message": "All fields required."
        });
        return;
    }

    passport.authenticate('local', function (err, user, info) {
        let token;

        if (err) {
            console.log(err);
            responseJSON(res, 404, err);
            return;
        }

        if (user) {
            token = user.generateJwt();
            responseJSON(res, 200, {
                "token": token
            });
        } else {
            responseJSON(res, 401, info);
        }
    })(req, res);
}

module.exports = login;