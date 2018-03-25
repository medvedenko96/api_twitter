const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const likeSchema = new Schema({

    likes :
        [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]

});

let Like = mongoose.model('Like', likeSchema);