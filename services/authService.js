const passport = require('passport'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');
require('../middleware/passport');

let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};

module.exports.login = function  (req, res) {
    if (!req.body.email  || !req.body.password) {
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
};

module.exports.register = function (req, res) {
    if (!req.body.nickname || !req.body.firstname || !req.body.lastname
        || !req.body.email || !req.body.password || !req.body.about) {
        responseJSON(res, 400, {
            'message': "All fields required."
        });
        return;
    }

    let newUser = new User();
    newUser.nickname = req.body.nickname.toLowerCase();
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    newUser.email = req.body.email;
    newUser.about = req.body.about;
    newUser.setPassword(req.body.password);

    newUser.save((err) => {
        let token;
        if (err) {
            responseJSON(res, 404, err);
        } else {
            token = newUser.generateJwt();
            responseJSON(res, 200, {
                "token" : token
            });
        }
    })
};

