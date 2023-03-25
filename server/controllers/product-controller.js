const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ProductModel = require('../models/product-model');

const excelJS = require('exceljs');

module.exports = {
    addProduct : asyncHandler(async (req , res) => {
        const proCode = req.body.proCode;
        const proName = req.body.proName;
        const proPackaging = req.body.proPackaging;
        const consumerPrice = req.body.consumerPrice;

        const product = await ProductModel.create({ proCode , proName , proPackaging , consumerPrice });
        res.status(201).json({ data: product });
    }),

    getProducts : asyncHandler(async (req , res) => {
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 20
        const skip = (page - 1) * limit

        const products = await ProductModel.find({})
        res.status(200).json({
            results : products.length,
            page : page,
            data : products.slice(skip,limit*page)
        })
    }),

    getProduct : asyncHandler( async (req,res,next) => {
        const { id } = req.params

        const product = await ProductModel.findById(id)
        if(!product) {
            next(new ApiError(`لا يوجد صنف بهذا الرقم ${id}` , 404))
        }
        else {
            res.status(200).json({ data : product })
        }
    }),

    updateProduct : asyncHandler( async (req,res,next) => {
        const { id } = req.params;
        const proName = req.body.proName;
        const proPackaging = req.body.proPackaging;
        const consumerPrice = req.body.consumerPrice;

        const product = await ProductModel.findByIdAndUpdate(
            { _id : id } , { proName , proPackaging , consumerPrice } , { new : true }
        )
        if(!product) {
            next(new ApiError(`لا يوجد صنف بهذا الرقم ${id}` , 404));
        }
        else {
            res.status(200).json({ data : product });
        }
    }),

    deleteProduct : asyncHandler( async (req,res,next) => {
        const { id } = req.params;

        const product = await ProductModel.findByIdAndDelete({ _id : id });
        if(!product) {
            next(new ApiError(`لا يوجد صنف بهذا الرقم ${id}` , 404));
        }
        else {
            res.status(204).send();
        }
    }),

    getReport : asyncHandler( async (req , res , next) => {
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('بيان الاصناف');
        const path = '../../الاصناف';

        workSheet.columns = [
            { header: 'كود الصنف' , key: 'proCode' , width: 12 },
            { header: 'اسم الصنف' , key: 'proName' , width: 50 },
            { header: 'العبوة' , key: 'proPackaging' , width: 10 },
            { header: 'سعر المستهلك' , key: 'consumerPrice' , width: 30 }
        ]

        var products = await ProductModel.find({})
        products.forEach(product => {
            workSheet.addRow(product);
        });

        workSheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
        });

        try {
            const data = await workBook.xlsx.writeFile( __dirname + `/products.xlsx`)
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