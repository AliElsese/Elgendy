const mongoose = require('mongoose');

const buyInvoiceSchema = new mongoose.Schema({
    invoiceDate: { type: String },
    invoiceNumber: {
        type: String,
        required: [true , 'The invoice number is required'],
        unique: true
    },
    invoiceTotal: { type: Number },
    products: [{
        proCode: {
            type: String,
            required: [true , 'The product code is required'],
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
        proSale: { type: Number },
        proTaxRate: { type: Number },
        proTaxValue: { type: Number },
        proTotalVat: { type: Number }
    }]
}, { timestamps: true });

const BuyInvoiceModel = mongoose.model('BuyInvoice', buyInvoiceSchema);

module.exports = BuyInvoiceModel;