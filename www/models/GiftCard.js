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
    descriptions: {
        type: String
    },
    image: {
        type: String
    },
    series: {
        type: String
    },
    code: {
        type: String
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
}, {collection: "GiftCard"});

module.exports = mongoose.model('GiftCard', GiftCardSchema);