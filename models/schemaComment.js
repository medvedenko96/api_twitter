const mongoose = require('mongoose');
const Schema = mongoose.Schema,
    moment = require('moment');


const commentSchema = new Schema({
    body : {
        type : String,
        required: true
    },
    createdAt: {
        type: String,
        default: moment(new Date()).format("MMM DD, YYYY")
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

});

let Comment = mongoose.model('Comment', commentSchema);