const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const SaleInvoiceModel = require('../models/sale-model');
const ProductModel = require('../models/product-model');
const StoreModel = require('../models/store-model');

const reader = require('xlsx');
const pdfToExcel = require('pdf-to-excel');

const fs = require('fs');
const csv = require('csv-parser');
const results = []
const readCSVFile = (csvFile) => {
    fs.createReadStream(csvFile).pipe(csv()).on('data' , (data) => {
        results.push(data)
    }).on('end' , () => {
        console.log(results[2]) 
    })
}

const createExcelFile = async (pdfFile) => {
    // await pdfToExcel.genXlsx(pdfFile , 'invoice.xlsx');
    const fileReader = reader.readFile(pdfFile);
    let data = []
    const sheets = fileReader.SheetNames
    for(let i = 0; i < sheets.length; i++) {
        const temp = reader.utils.sheet_to_json(fileReader.Sheets[fileReader.SheetNames[i]])
        temp.forEach((res) => {
            data.push(res)
        })
    }
    return data;
}

const getProductInfo = async (products) => {
    var invoice = {
        productsInfo : [],
        invoiceTotal : 0
    }
    for(var i = 0; i < products.length; i++) {
        var product = await ProductModel.findOne({ proCode: products[i].proCode });
        // if(!product || product.length == 0) {
        //     return (new ApiError(`Product Not Found With This Code:${products[i].proCode} Insert It First..` , 404));
        // }
        var productInfo = {
            proCode: product.proCode,
            proName: product.proName,
            proQuantity: products[i].proQuantity,
            proCost: products[i].proCost,
            proSale: products[i].proSale,
            proExtraSale: products[i].proExtraSale,
            proTaxRate: products[i].proTaxRate,
            proTaxValue: (products[i].proTaxRate == '5' ? Math.abs(( ( ( (products[i].proCost * products[i].proQuantity) - products[i].proSale ) * products[i].proTaxRate ) / 105 )).toFixed(2) : Math.abs((( ( (products[i].proCost * products[i].proQuantity) - products[i].proSale ) * products[i].proTaxRate ) / 114 )).toFixed(2)),
            proTotalVat: Math.abs((products[i].proCost * products[i].proQuantity) - products[i].proSale),
        }
        invoice.invoiceTotal = invoice.invoiceTotal + productInfo.proTotalVat;
        invoice.productsInfo.push(productInfo);
    }
    return invoice;
}

const getStoreProducts = async (products) => {
    let storeProducts = []
    for(var i = 0; i < products.length; i++) {
        var product = await StoreModel.findOneAndUpdate({ proCode: products[i].proCode } , {
            $inc:{ proQuantity: products[i].proQuantity },
            proCost: products[i].proCost,
            proSale: products[i].proSale,
            proExtraSale: products[i].proExtraSale,
            proTaxRate: products[i].proTaxRate,
            proTaxValue: products[i].proTaxValue,
            proTotalVat: products[i].proTotalVat
        } , { new: true });
        if(!product || product == undefined) {
            storeProducts.push(products[i]);
        }
    }
    return storeProducts;
}

module.exports = {
    createSaleInvoice : asyncHandler(async (req , res , next) => {
        const data = await readCSVFile(req.file.originalname)
        // const data = await createExcelFile(req.file.originalname);
        // const invoiceUrl = `server/uploads/${req.file.filename}`;
        // const invoiceNumber = data[0].__EMPTY_5;

        // for(var i = 0; i < data.length; i++) {
        //     if(data[i].__EMPTY == "0" || data[i].__EMPTY == undefined || isNaN(Object.values(data[i])[Object.keys(data[i]).length - 1])) continue;
        //     if(isNaN(Object.values(data[i])[1]) || Object.values(data[i])[Object.keys(data[i]).length - 1].startsWith('01')) continue;
        //     console.log(Object.values(data[i])[1]) // كود الصنف
        //     console.log(Object.values(data[i])[Object.keys(data[i]).length - 1]) // نسبة الضريبة
        //     console.log(Object.values(data[i])[Object.keys(data[i]).length - 2]) // الخصم الاضافي
        //     if(Object.values(data[i])[Object.keys(data[i]).length - 3] == "-") {
        //         console.log(Math.abs((Object.values(data[i])[Object.keys(data[i]).length - 4]).split(',').join(''))) // الخصم
        //         if(/^[0-9]|[0-9]$/.test(Object.values(data[i])[Object.keys(data[i]).length - 5])) {
        //             if(/^[0-9]/.test(Object.values(data[i])[Object.keys(data[i]).length - 9])) {
        //                 console.log(Object.values(data[i])[Object.keys(data[i]).length - 9]) // السعر
        //                 console.log(Object.values(data[i])[Object.keys(data[i]).length - 10]) // الكمية
        //                 console.log(i);
        //             }
        //             else {
        //                 console.log(Object.values(data[i])[Object.keys(data[i]).length - 10]) // السعر
        //                 console.log(Object.values(data[i])[Object.keys(data[i]).length - 11]) // الكمية
        //                 console.log(i);
        //             }
        //         }
        //         else {
        //             console.log(Object.values(data[i])[Object.keys(data[i]).length - 7]) // السعر
        //             console.log(Object.values(data[i])[Object.keys(data[i]).length - 8]) // الكمية
        //             console.log(i);
        //         }
        //     }
        //     else {
        //         console.log(Math.abs((Object.values(data[i])[Object.keys(data[i]).length - 3]).split(',').join('')))
        //         if(/^[0-9]|[0-9]$/.test(Object.values(data[i])[Object.keys(data[i]).length - 4])) {
        //             if(/^[0-9]/.test(Object.values(data[i])[Object.keys(data[i]).length - 8])) {
        //                 console.log(Object.values(data[i])[Object.keys(data[i]).length - 8]) // السعر
        //                 console.log(Object.values(data[i])[Object.keys(data[i]).length - 9]) // الكمية
        //             }
        //             else {
        //                 console.log(Object.values(data[i])[Object.keys(data[i]).length - 9]) // السعر
        //                 console.log(Object.values(data[i])[Object.keys(data[i]).length - 10]) // الكمية
        //             }
        //             console.log(i);
        //         }
        //         else {
        //             console.log(Object.values(data[i])[Object.keys(data[i]).length - 6]) // السعر
        //             console.log(Object.values(data[i])[Object.keys(data[i]).length - 7]) // الكمية
        //             console.log(i);
        //         }
        //     }
        // }
        res.send(data)
        // console.log(/^[0-9]/.test('12*12'))
    }),

    addInvoice : asyncHandler(async (req , res ) => {
        const invoiceNumber = req.body.invoiceNumber;
        const products = req.body.products;

        const productsInfo = await getProductInfo(products);

        // const storeProducts = await getStoreProducts(productsInfo);

        // if(storeProducts.length != 0) { await StoreModel.create(storeProducts); }

        const invoiceProducts = await SaleInvoiceModel.create({ invoiceNumber , products: productsInfo.productsInfo , invoiceTotal: productsInfo.invoiceTotal });
        res.status(201).json({ data: invoiceProducts });
    }),

    getInvoices : asyncHandler(async (req , res) => {
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 20
        const skip = (page - 1) * limit

        const invoices = await SaleInvoiceModel.find({})
        res.status(200).json({
            results : invoices.length,
            page : page,
            data : invoices.slice(skip,limit*page)
        })
    }),

    getInvoice : asyncHandler( async (req,res,next) => {
        const { id } = req.params

        const invoice = await SaleInvoiceModel.findById(id)
        if(!invoice) {
            next(new ApiError(`No Invoice For This Id ${id}` , 404))
        }
        else {
            res.status(200).json({ data: invoice })
        }
    }),

    updateInvoice : asyncHandler( async (req,res,next) => {
        const { id } = req.params;
        const invoiceNumber = req.body.invoiceNumber;
        const products = req.body.products;

        const invoice = await SaleInvoiceModel.findByIdAndUpdate(
            { _id : id } , { invoiceNumber , products } , { new : true }
        )
        if(!invoice) {
            next(new ApiError(`No Invoice For This Id ${id}` , 404));
        }
        else {
            res.status(200).json({ data: invoice });
        }
    }),

    deleteInvoice : asyncHandler( async (req,res,next) => {
        const { id } = req.params;

        const invoice = await SaleInvoiceModel.findByIdAndDelete({ _id : id });
        if(!invoice) {
            next(new ApiError(`No Invoice For This Id ${id}` , 404));
        }
        else {
            res.status(204).send();
        }
    })
}