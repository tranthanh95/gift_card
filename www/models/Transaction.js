const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new mongoose.Schema({
    orderask: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderAsk'
        }
    ],
    orderbid: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderBid'
        }
    ],
    price: {
        type: int,
        required: true,
        unique: true
    },
    descriptions: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
}, {collection: "Transaction"});

module.exports = mongoose.model('Transaction', TransactionSchema);