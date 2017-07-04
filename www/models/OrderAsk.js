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
    id: {
        type: int,
        required: true,
        unique: true
    },
    priceask: {
        type: int,
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
}, {collection: "OrderAsk"});

module.exports = mongoose.model('OrderAsk', OrderAskSchema);