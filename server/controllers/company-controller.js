const multer = require('multer');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const CompanyModel = require('../models/company-model');

// Memory Storage Engine
const multerStorage = multer.memoryStorage();

// Multer Filter Images
const multerFilter = function(req , file , cb) {
    if(file.mimetype.startsWith('image')) {
        cb(null , true)
    }
    else {
        cb(new ApiError('مسموح بالصور فقط' , 400) , false)
    }
};
const upload = multer({ storage: multerStorage , fileFilter: multerFilter })

module.exports = {
    getAllCompanies : asyncHandler(async (req , res) => {
        const companies = await CompanyModel.find({});
        res.status(200).json({ data: companies });
    }),

    uploadCompanyImage : upload.single('companyImage'),

    resizeImage : asyncHandler(async (req , res , next) => {
        const filename = `company-${uuidv4()}-${Date.now()}.jpeg`;
    
        await sharp(req.file.buffer)
            .resize(400 , 400)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(`server/uploads/الشركات/${filename}`);

        req.body.companyImage = `${filename}`;
    
        next();
    }),

    createCompany : asyncHandler(async (req , res) => {
        const company = await CompanyModel.create(req.body);
        res.status(201).json({ data: company });
    }),

    getCompany : asyncHandler(async (req , res) => {
        const { id } = req.params;
        const company = await CompanyModel.findOne({ _id: id });
        res.status(200).json({ data: company });
    }),

    updateCompany : asyncHandler(async (req , res , next) => {
        const id = req.params.id;
        const companyName = req.body.companyName;
        const companyScope = req.body.companyScope;
        const companyAddress = req.body.companyAddress;
        const companyTaxNumber = req.body.companyTaxNumber;

        const company = await CompanyModel.findOneAndUpdate(
            { _id: id } , { companyName , companyScope , companyAddress , companyTaxNumber } , { new: true }
        );
        if(!company) {
            next(new ApiError('هذه الشركة غير موجوده' , 404));
        }
        else {
            res.status(200).json({ data: company });
        }
    }),

    deleteCompany : asyncHandler(async (req , res , next) => {
        const id = req.params.id;

        const company = await CompanyModel.findByIdAndDelete({ _id: id });
        if(!company) {
            next(new ApiError('ههذه الشركة غير موجوده' , 404));
        }
        else {
            res.status(204).send();
        }
    }),
}