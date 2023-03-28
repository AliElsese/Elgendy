const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const StoreModel = require('../models/store-model');
const ProductModel = require('../models/product-model');

const path = require('path');
const excelJS = require('exceljs');

const getProductInfo = async (productCode) => {
    var product = await ProductModel.findOne({ proCode: productCode });
    return product.proName;
}

module.exports = {
    addStoreProduct : asyncHandler(async (req , res , next) => {
        const productName = await getProductInfo(req.body.proCode);
        const productInfo = {
            proCode: req.body.proCode,
            proName: productName,
            proQuantity: req.body.proQuantity,
            proCost: req.body.proCost,
        }

        const product = await StoreModel.create(productInfo);
        res.status(201).json({ data: product });
    }),

    updateStoreProduct : asyncHandler(async (req , res , next) => {
        const proQuantity = req.body.proQuantity;
        const proCost = req.body.proCost;

        const product = await StoreModel.findByIdAndUpdate({ _id: req.params.id } , { proQuantity , proCost } , { new: true });
        if(!product) {
            next(new ApiError(`لا يوجد صنف بهذا الرقم ${id}` , 404));
        }
        else {
            res.status(200).json({ data: product });
        }
    }),

    getStoreProducts : asyncHandler(async (req , res , next) => {
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 20
        const skip = (page - 1) * limit

        const storeProducts = await StoreModel.find({})
        res.status(200).json({
            results : storeProducts.length,
            page : page,
            data : storeProducts.slice(skip,limit*page)
        })
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
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('بيان المخزن');
        const filePath = path.resolve("./الاصناف");

        workSheet.columns = [
            { header: 'كود الصنف' , key: 'proCode' , width: 15 },
            { header: 'اسم الصنف' , key: 'proName' , width: 50 },
            { header: 'الكمية' , key: 'proQuantity' , width: 15 },
            { header: 'السعر' , key: 'proCost' , width: 15 }
        ]

        var products = await StoreModel.find({})
        products.forEach(product => {
            workSheet.addRow(product);
        });

        workSheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
        });

        try {
            const data = await workBook.xlsx.writeFile( __dirname + `/store.xlsx`)
            .then(() => {
                res.send({
                status: "success",
                message: "تم تجهيز البيان بنجاح",
                path: `${path}/products.xlsx`,
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