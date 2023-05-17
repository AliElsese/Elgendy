const mongoose = require('mongoose');

const saleInvoiceSchema = new mongoose.Schema({
    // invoiceUrl: { type: String },
    // company
    companyName: { type: String },
    companyScope: { type: String },
    companyBranche: { type: String },
    companyAddress: { type: String },
    companyTaxNumber: { type: String },
    // client
    clientName: { type: String },
    clientAddress: { type: String },
    registrationNumber: { type: String },
    // invoice
    invoiceDate: { type: String },
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
        proPackaging: { 
            type: String,
            default: 'CAR'
        },
        proPrice: { type: Number },
        proQuantity: { type: Number },
        proSale: { type: Number },
        proTaxValue: { type: Number },
        proTotalVat: { type: Number }
    }],
    // totals
    invoiceTotal: { type: Number },
    invoiceTotalSale: { type: Number },
    invoiceTotalTax: { type: Number },
    invoiceTotalVat: { type: Number }
}, { timestamps: true });

const SaleInvoiceModel = mongoose.model('SaleInvoice', saleInvoiceSchema);

module.exports = SaleInvoiceModel;