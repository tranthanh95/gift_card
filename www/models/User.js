const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: String,
    admin: Boolean,
    salt: Number,
    block: {
        type: Number,
        default: 0
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: Date,
    giftCard: [
        {
            type: Schema.Types.ObjectId,
            ref: 'GiftCard'
        }
    ],
    orderBid: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderBid'
        }
    ],
    orderAsk: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderAsk'
        }
    ]
}, {collection: "User"});

module.exports = mongoose.model('User', UserSchema);