const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const twitSchema = new Schema({
    title : {
        type : String,
        required: true
    },
    text : {
        type : String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }

});

let Twit = mongoose.model('Twit', twitSchema);