const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const StoreModel = require('../models/store-model');
const ProductModel = require('../models/product-model');

const path = require('path');
const excelJS = require('exceljs');

const getProductInfo = async (productCode) => {
    var product = await ProductModel.findOne({ proCode: productCode });
    return product;
}

module.exports = {
    addStoreProduct : asyncHandler(async (req , res , next) => {
        const productData = await getProductInfo(req.body.proCode);
        const productInfo = {
            proCode: req.body.proCode,
            proName: productData.proName,
            proPackaging: productData.proPackaging,
            proPrice: productData.proPrice,
            proQuantity: req.body.proQuantity,
            isFixed: productData.isFixed
        }

        const product = await StoreModel.create(productInfo);
        res.status(201).json({ data: product });
    }),

    getStoreProducts : asyncHandler(async (req , res , next) => {
        const storeProducts = await StoreModel.find({})
        res.status(200).json({ data : storeProducts })
    }),

    getStoreProduct : asyncHandler(async (req , res , next) => {
        const { id } = req.params

        const product = await StoreModel.findById(id)
        if(!product) {
            next(new ApiError(`لا يوجد صنف بهذا الرقم ${id}` , 404))
        }
        else {
            res.status(200).json({ data: product })
        }
    }),

    updateStoreProduct : asyncHandler(async (req , res , next) => {
        const proPrice = req.body.proPrice;
        const proQuantity = req.body.proQuantity;
        const isFixed = req.body.isFixed;

        const product = await StoreModel.findByIdAndUpdate({ _id: req.params.id } , { proPrice , proQuantity , isFixed } , { new: true });
        if(!product) {
            next(new ApiError(`لا يوجد صنف بهذا الرقم ${id}` , 404));
        }
        else {
            res.status(200).json({ data: product });
        }
    }),

    deleteStoreProduct : asyncHandler( async (req,res,next) => {
        const { id } = req.params;

        const product = await StoreModel.findByIdAndDelete({ _id : id });
        if(!product) {
            next(new ApiError(`لا يوجد صنف بهذا الرقم ${id}` , 404));
        }
        else {
            res.status(204).send();
        }
    }),

    getReport : asyncHandler( async (req , res , next) => {
        const d = new Date();
        const dateNumber = d.toLocaleDateString('en-GB').replaceAll('/' , '-')
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('بيان المخزن');
        const filePath = path.resolve("./uploads/المخزن");

        workSheet.columns = [
            { header: 'كود الصنف' , key: 'proCode' , width: 15 },
            { header: 'اسم الصنف' , key: 'proName' , width: 50 },
            { header: 'العبوة' , key: 'proPackaging' , width: 15 },
            { header: 'السعر' , key: 'proPrice' , width: 15 },
            { header: 'الكمية' , key: 'proQuantity' , width: 15 },
            { header: 'نسبة الضريبة' , key: 'proTaxRate' , width: 15 },
        ]

        var products = await StoreModel.find({})
        products.forEach(product => {
            workSheet.addRow(product);
        });

        workSheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
        });

        try {
            const data = await workBook.xlsx.writeFile( filePath + `/store-${uuidv4()}(${dateNumber}).xlsx`)
            .then(() => {
                res.send({
                status: "success",
                message: "تم تجهيز البيان بنجاح",
                });
            });
        }
        catch (err) {
            res.send({
                status: "error",
                message: "Something went wrong",
            });
        }
    })
}