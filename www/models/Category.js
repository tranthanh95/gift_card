const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new mongoose.Schema({
    orderask: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderAsk'
        }
    ],
    giftcard: [
        {
            type: Schema.Types.ObjectId,
            ref: 'GiftCard'
        }
    ],
    name: {
        type: String,
        required: true
    },
    parent : {
        type: String
    },
    type :{
        type : String
    },
    value: {
        type: Number
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: Date
}, {collection: "Category"});

module.exports = mongoose.model('Category', CategorySchema);