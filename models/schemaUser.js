const crypto = require('crypto'),
    mongoose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    moment = require('moment');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    nickname : {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    about : {
        type: String
    },
    hash: String,
    salt: String ,
    twits:[{
            type: Schema.Types.ObjectId,
            ref: 'twit'
    }],
    followers :
        [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }] ,
    following :
        [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }] ,
    createdAt: {
        type: String,
        default: moment(new Date()).format("MMM DD, YYYY")
    }

});


userSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};


userSchema.methods.validPassword = function (password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.methods.generateJwt = function () {


    return jwt.sign({
        _id: this._id,
        email: this.email,
        nickname: this.nickname
    },
        process.env.SECRET,
    {
        expiresIn: '10 days'
    });
};



mongoose.model('User', userSchema);
