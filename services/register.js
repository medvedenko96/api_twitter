const mongoose = require('mongoose'),
    User = mongoose.model('User');
require('./passport');

let responseJSON = (res, status, content) => {
    res.status(status);
    res.json(content);
};

function  register (req, res) {
    if (!req.body.firstname || !req.body.lastname || !req.body.email || !req.body.password || !req.body.about) {
        responseJSON(res, 400, {
            'message': "All fields required."
        });
        return;
    }

    let newUser = new User();
    newUser.firstname = req.body.firstname;
    newUser.lastname = req.body.lastname;
    newUser.email = req.body.email;
    newUser.about = req.body.about;
    newUser.fullname = `${req.body.firstname} ${req.body.lastname}`;
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
}

module.exports = register;

