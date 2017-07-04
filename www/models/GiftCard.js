const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GiftCardSchema = new mongoose.Schema({
    orderbid: [
        {
            type: Schema.Types.ObjectId,
            ref: "OrderBid"
        }
    ],
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    orderask: [
        {
            type: Schema.Types.ObjectId,
            ref: "OrderAsk"
        }
    ],
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    id: {
        type: int,
        required: true,
        unique: true
    },
    descriptions: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    series: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    type: {
        type: int,
        required: true
    },
    value: {
        type: int,
        required: true
    },
    owncol: {
        type: Text,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
    updated_at: {
        type: Date,
        required: true
    }
}, {collection: "GiftCard"});

module.exports = mongoose.model('GiftCard', GiftCardSchema);