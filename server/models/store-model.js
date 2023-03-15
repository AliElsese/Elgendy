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
    proCost: { type: String },
    proSale: { type: String },
    proExtraSale: { type: String },
    proTaxRate: { type: String },
    proTaxValue: { type: String },
    proTotalVat: { type: String }
}, { timestamps: true });

const StoreModel = mongoose.model('Store', storeSchema);

module.exports = StoreModel;