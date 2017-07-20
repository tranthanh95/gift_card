const GiftCard = require('../models/GiftCard');

const GiftCardService = {
    // Service return list gift.
    listGift: function (callback) {
        GiftCard
            .find()
            .populate('category')
            .exec(callback);
    },
    // Service show information gift using id category.
    listGiftByCate: function (idCate, callback) {
        GiftCard
            .find({category: idCate})
            .populate({
                path: 'category',
                match: {
                    _id: {
                        $eq: idCate
                    }
                },
                options: {
                    limit: 5
                }
            })
            .exec(callback);
    },
    // Service show list gifts by id.
    listGiftById: function (id, callback) {
        GiftCard
            .find({_id: id})
            .populate("user")
            .populate("category")
            .exec(callback);
    },
    // Service show gift by id.
    giftById: function (id, callback) {
        GiftCard
            .findOne({_id: id})
            .populate("user")
            .populate("category")
            .exec(callback);
    },

    // Service add a giftcard fron user typing.
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
// Export module.
module.exports = GiftCardService;