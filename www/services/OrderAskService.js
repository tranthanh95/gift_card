const OrderAsk = require("../models/OrderAsk");

const OrderAskService = {

	addItem: function (CreateOrderAsk, callback) {
        var orderAsk = new OrderAsk({
        	
        	user : CreateOrderAsk.user,
        	giftcard: CreateOrderAsk.giftcard,
            priceask: CreateOrderAsk.priceask,
            created_at: new Date()
        });
        orderAsk.save(callback);
    }
}
module.exports = OrderAskService;