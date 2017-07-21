const OrderBid = require("../models/OrderBid");

const OrderBidService = {

		addItem: function (CreateOrderBid, callback) {
        var orderbid = new OrderBid({
        	
        	user : CreateOrderBid.user,
        	giftcard: CreateOrderBid.giftcard,
            price: CreateOrderBid.price,
            fromPrice_toPrice: CreateOrderBid.fromPrice_toPrice,
            expiresDate: CreateOrderBid.expiresDate,
            created_at: new Date()
        });
        orderbid.save(callback);
    }
}
module.exports = OrderBidService;