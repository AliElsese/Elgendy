const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ProductModel = require('../models/product-model');

const path = require('path');
const excelJS = require('exceljs');

module.exports = {
    addProduct : asyncHandler(async (req , res) => {
        const proCode = req.body.proCode;
        const proName = req.body.proName;
        const proPackaging = req.body.proPackaging;
        const proPrice = req.body.proPrice;
        const isFixed = req.body.isFixed;

        const product = await ProductModel.create({ proCode , proName , proPackaging , proPrice , isFixed });
        res.status(201).json({ data: product });
    }),

    getProducts : asyncHandler(async (req , res) => {
        const products = await ProductModel.find({})
        res.status(200).json({ data : products })
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
        const proPrice = req.body.proPrice;

        const product = await ProductModel.findByIdAndUpdate(
            { _id : id } , { proName , proPackaging , proPrice } , { new : true }
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
        const d = new Date();
        const dateNumber = d.toLocaleDateString('en-GB').replaceAll('/' , '-')
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('بيان الاصناف');
        const filePath = path.resolve("./uploads/الاصناف");

        workSheet.columns = [
            { header: 'كود الصنف' , key: 'proCode' , width: 12 },
            { header: 'اسم الصنف' , key: 'proName' , width: 50 },
            { header: 'العبوة' , key: 'proPackaging' , width: 15 },
            { header: 'السعر' , key: 'proPrice' , width: 12 }
        ]

        var products = await ProductModel.find({})
        products.forEach(product => {
            workSheet.addRow(product);
        });

        workSheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
        });

        try {
            const data = await workBook.xlsx.writeFile( filePath + `/products-${uuidv4()}(${dateNumber}).xlsx`)
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
                message: err,
            });
        }
    }),

    getProductByCode : (async (req , res , next) => {
        const { proCode } = req.body

        const product = await ProductModel.findOne({ proCode })
        if(!product) {
            next(new ApiError(`لا يوجد صنف بهذا الرقم ${proCode}` , 404))
        }
        else {
            res.status(200).json({ data : product })
        }
    }),

    addNewProducts : asyncHandler(async (req , res , next) => {
        const productsArr = req.body.products;
        for(let x = 0; x < productsArr.length; x++) {
            const product = await ProductModel.findOne({ proCode: productsArr[x].proCode });
            if(!product) {
                const productInfo = {
                    proCode: productsArr[x].proCode,
                    proName: productsArr[x].proName,
                    proPackaging: productsArr[x].proPackaging,
                    proPrice: productsArr[x].proPrice,
                    isFixed: productsArr[x].isFixed
                }
                const insertedProduct = await ProductModel.create(productInfo);
            }
        }
        res.status(201).json({ data: productsArr });
    })
}