const mongoose = require('mongoose');
let productSchema = new mongoose.Schema({
        id: String,
        product_name: String,
        product_url: String,
        pid: String,
        retail_price: Number,
        discounted_price: Number,
        is_FK_assured: Boolean,
        brand: String
    },
    {
        timestamps: true
    });
module.exports = mongoose.model("product", productSchema, "products");