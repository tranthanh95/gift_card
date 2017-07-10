const Category = require("../models/Category");

const CategoryService = {
    listCategory: function (callback) {
        Category.find(callback);
    },
    addItem: function (callback) {
        var category = new Category({name: "Shoe", type: "%", value: 120, created_at: new Date()});
        category.save(callback);
    }
}

module.exports = CategoryService;