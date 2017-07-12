const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderBidSchema = new mongoose.Schema({
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    giftcard: [
        {
            type: Schema.Types.ObjectId,
            ref: 'GiftCard'
        }
    ],
    transaction: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Transaction'
        }
    ],
    price: {
        type: Number,
        required: true
    },
    fromPrice_toPrice: {
        type: Number,
        required: true
    },
    expiresDate: {
        type: Date
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
}, {collection: "OrderBid"});

module.exports = mongoose.model('OrderBid', OrderBidSchema);