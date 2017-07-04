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
    id: {
        type: Schema.Types.ObjectId,
        ref: 'GiftCard',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: Double,
        required: true
    },
    value: {
        type: Double,
        required: true
    },
    created_at: {
        type: Date
    },
    updated_at: {
        type: Date
    }
}, {collection: "Category"});

module.exports = mongoose.model('Category', CategorySchema);