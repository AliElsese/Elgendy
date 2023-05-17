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
    proPackaging: { 
        type: String,
        default: 'CAR'
    },
    proPrice: { type: Number },
    proQuantity: { type: Number },
    isFixed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const StoreModel = mongoose.model('Store', storeSchema);

module.exports = StoreModel;