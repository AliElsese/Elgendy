const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const BuyInvoiceModel = require('../models/buy-model');
const ProductModel = require('../models/product-model');
const StoreModel = require('../models/store-model');

const reader = require('xlsx');
const pdfToExcel = require('pdf-to-excel');

const createExcelFile = async (pdfFile) => {
    await pdfToExcel.genXlsx(pdfFile , 'invoice.xlsx');
    const fileReader = reader.readFile('invoice.xlsx');
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
    var productsInfo = [];
    for(var i = 0; i < products.length; i++) {
        var product = await ProductModel.findOne({ proCode: products[i].proCode });
        if(!product || product.length == 0) {
            next(new ApiError(`Product Not Found With This Code:${products[i].proCode} Insert It First..` , 404));
        }
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
        productsInfo.push(productInfo);
    }
    return productsInfo;
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
    createBuyInvoice : asyncHandler(async (req , res , next) => {
        const data = await createExcelFile(req.file.originalname);
        const invoiceUrl = `server/uploads/${req.file.filename}`;
        const invoiceNumber = data[0].__EMPTY_5;

        for(var i = 0; i < data.length; i++) {
            if(data[i].__EMPTY == "0" || data[i].__EMPTY == undefined) continue;
            console.log(i);
        }
        res.send(data[12]);
        // console.log(data[6])
        // console.log(data[0])
        // console.log(data[6])
        // console.log(data[9])
        // console.log(data[12])
        // console.log(data[15])
        // console.log(data[18])
        // console.log(data[30])
        // console.log(data[32])
    }),

    addInvoice : asyncHandler(async (req , res , next) => {
        const invoiceNumber = req.body.invoiceNumber;
        const products = req.body.products;

        const productsInfo = await getProductInfo(products);

        const storeProducts = await getStoreProducts(productsInfo);

        if(storeProducts.length != 0) { await StoreModel.create(storeProducts); }

        const invoiceProducts = await BuyInvoiceModel.create({ invoiceNumber , products: productsInfo });
        res.status(201).json({ data: invoiceProducts });
    }),

    getInvoices : asyncHandler(async (req , res) => {
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 20
        const skip = (page - 1) * limit

        const invoices = await BuyInvoiceModel.find({})
        res.status(200).json({
            results : invoices.length,
            page : page,
            data : invoices.slice(skip,limit*page)
        })
    }),

    getInvoice : asyncHandler( async (req,res,next) => {
        const { id } = req.params

        const invoice = await BuyInvoiceModel.findById(id)
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

        const invoice = await BuyInvoiceModel.findByIdAndUpdate(
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

        const invoice = await BuyInvoiceModel.findByIdAndDelete({ _id : id });
        if(!invoice) {
            next(new ApiError(`No Invoice For This Id ${id}` , 404));
        }
        else {
            res.status(204).send();
        }
    })
}