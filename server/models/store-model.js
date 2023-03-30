const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    proCode: {
        type: String,
        required: [true , 'The product code is required'],
        unique: true
    },
    proName: {
        type: String,
        required: [true , 'The product name is required'],
    },
    proQuantity: { type: Number },
    proPrice: { type: Number },
}, { timestamps: true });

const StoreModel = mongoose.model('Store', storeSchema);

module.exports = StoreModel;