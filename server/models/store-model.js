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
    proCost: { type: Number },
    proSale: { type: Number },
    proExtraSale: { type: Number },
    proTaxRate: { type: Number },
    proTaxValue: { type: Number },
    proTotalVat: { type: Number }
}, { timestamps: true });

const StoreModel = mongoose.model('Store', storeSchema);

module.exports = StoreModel;