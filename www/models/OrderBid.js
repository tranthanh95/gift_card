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
    id: {
        type: int,
        required: true,
        unique: true
    },
    price: {
        type: int,
        required: true,
        unique: true
    },
    fromPrice_toPrice: {
        type: int,
        required: true
    },
    expiresDate: {
        type: Date,
        required: true
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