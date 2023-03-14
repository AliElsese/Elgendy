const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    proCode: {
        type: String,
        required: [true , 'proCode Required']
    },
    proName: {
        type: String,
        required: [true , 'proName Required']
    },
    proPackaging: { type: String },
    consumerPrice: { type: String }
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

module.exports = ProductModel;