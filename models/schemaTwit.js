const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const twitSchema = new Schema({
    title : {
        type : String,
        required: true
    },
    body : {
        type : String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    tags:[
        {type: String}
        ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

let twit = mongoose.model('twit', twitSchema);