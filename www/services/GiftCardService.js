const GiftCard = require('../models/GiftCard');

const GiftCardService = {

    listGift: function (callback) {
        GiftCard
            .find()
            .populate('category')
            .exec(callback);
    },

    listGiftByCate: function(idCate, callback) {
        GiftCard
            .find({category: idCate})
            .populate({
                path: 'category',
                match: { _id: { $eq: idCate }},
                options: { limit: 5 }
            })
            .exec(callback);
    },

    listGiftById: function (id, callback) {
        GiftCard
            .find({_id: id})
            .populate("user")
            .populate("category")
            .exec(callback);
    },

    giftById: function (id, callback) {
        GiftCard
            .findOne({_id: id})
            .populate("user")
            .populate("category")
            .exec(callback);
    },
    // findUserByEmail: function (email, callback) {     User.findOne({ email     },
    // callback); },

    addItem: function (giftcard, callback) {
        var giftcard = new GiftCard({
            series: giftcard.series,
            code: giftcard.code,
            image: giftcard.image,
            descriptions: giftcard.descriptions,
            created_at: new Date(),
            user: giftcard.user,
            category: giftcard.category
        });
        giftcard.save(callback);
    }

}

module.exports = GiftCardService;