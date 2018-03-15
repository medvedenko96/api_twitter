const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    moment = require('moment');


const twitSchema = new Schema({
    title : {
        type : String,
        required: true
    },
    body : {
        type : String,
        required: true
    },
    createdAt: {
        type: String,
        default: moment(new Date()).format("MMM DD, YYYY")
    },
    tags:[
        {type: String}
        ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

let Twit = mongoose.model('Twit', twitSchema);