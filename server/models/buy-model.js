const mongoose = require('mongoose');

const buyInvoiceSchema = new mongoose.Schema({
    invoiceUrl: { type: String },
    invoiceNumber: {
        type: String,
        required: [true , 'The invoice number is required'],
        unique: true
    },
    products: [{
        proCode: {
            type: String,
            required: [true , 'The product code is required'],
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
    }]
}, { timestamps: true });

const BuyInvoiceModel = mongoose.model('BuyInvoice', buyInvoiceSchema);

module.exports = BuyInvoiceModel;