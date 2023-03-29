const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true , 'اسم الشركة مطلوب']
    },
    companyScope: {
        type: String,
        required: [true , 'تخصص الشركة مطلوب']
    },
    companyAddress: {
        type: String,
        required: [true , 'عنوان الشركة مطلوب']
    },
    companyTaxNumber: {
        type: String,
        required: [true , 'رقم التسيجل الضريبي مطلوب']
    },
    companyBranche: {
        type: String,
        required: [true , 'الفرع مطلوب']
    }
} , { timestamps: true });

const CompanyModel = mongoose.model('Companies', companySchema);

module.exports = CompanyModel;