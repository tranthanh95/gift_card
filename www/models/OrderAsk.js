const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderAskSchema = new mongoose.Schema({
    user: [
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    giftcard: [
        {
            type: Schema.Types.ObjectId,
            ref: "GiftCard"
        }
    ],
    category: [
        {
            type: Schema.Types.ObjectId,
            ref: "Category"
        }
    ],
    transaction: [
        {
            type: Schema.Types.ObjectId,
            ref: "Transaction"
        }
    ],
    priceask: {
        type: Number,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
}, {collection: "OrderAsk"});

module.exports = mongoose.model('OrderAsk', OrderAskSchema);