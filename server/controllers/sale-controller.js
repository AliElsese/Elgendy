const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const SaleInvoiceModel = require('../models/sale-model');
const ProductModel = require('../models/product-model');
const StoreModel = require('../models/store-model');

const { spawn } = require('child_process');

const fs = require('fs');
const csv = require('csv-parser');

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
            $inc:{ proQuantity: -(products[i].proQuantity) },
        } , { new: true });
        if(!product || product == undefined) {
            storeProducts.push(products[i]);
        }
    }
    return storeProducts;
}

module.exports = {
    createSaleInvoice : asyncHandler(async (req , res , next) => {
        var oldInvoice = await SaleInvoiceModel.findOne({ invoiceNumber: req.body.invoiceNumber })
        if(oldInvoice) {
            next(new ApiError(`رقم الفاتورة مسجل من قبل` , 400))
        }
        else {
            var invoiceUrl = req.file.path;
            var invoiceNumber = req.body.invoiceNumber;
            var results = []
            var products = []
            var unfoundProducts = []
            var invoiceTotal = 0
            const childPython = spawn('python' , ['pdfreader.py' , req.file.path])
            childPython.stdout.on('data' , (data) => {
                for(var y = 0; y < data; y++) {
                    fs.createReadStream(__dirname + `/table_${y}.csv`).pipe(csv()).on('data' , (response) => {
                        results.push(response)
                    }).on('end' , async () => {
                        for(var i = 0; i < results.length; i++) {
                            if(Object.values(results[i])[Object.keys(results[i]).length - 1] == '') continue;
                            var productCode = (Object.values(results[i])[Object.keys(results[i]).length - 1]).replace('.0' , '')
                            await ProductModel.findOne({ proCode: productCode }).then(product => {
                                if(product) {
                                    if((Object.values(results[i])[6]) == '') {
                                        var invoiceProduct = {
                                            proCode: productCode,
                                            proName: product.proName,
                                            proQuantity: Number((Object.values(results[i])[8]).replace(',','')),
                                            proCost: Number((Object.values(results[i])[7]).replace(',','')),
                                            proSale: Math.abs(Number((Object.values(results[i])[4]).replace(',',''))),
                                            proExtraSale: Number((Object.values(results[i])[3]).replace(',','')),
                                            proTaxRate: Number((Object.values(results[i])[2]).replace(',','')),
                                            proTaxValue: (Number((Object.values(results[i])[2]).replace(',','')) == 5 ? Math.abs(( ( ( (Number((Object.values(results[i])[7]).replace(',','')) * Number((Object.values(results[i])[8]).replace(',',''))) - Math.abs(Number((Object.values(results[i])[4]).replace(',',''))) ) * Number((Object.values(results[i])[2]).replace(',','')) ) / 105 )).toFixed(2) : Math.abs((( ( (Number((Object.values(results[i])[7]).replace(',','')) * Number((Object.values(results[i])[8]).replace(',',''))) - Math.abs(Number((Object.values(results[i])[4]).replace(',',''))) ) * Number((Object.values(results[i])[2]).replace(',','')) ) / 114 )).toFixed(2)),
                                            proTotalVat: Math.abs((Number((Object.values(results[i])[7]).replace(',','')) * Number((Object.values(results[i])[8]).replace(',',''))) - Math.abs(Number((Object.values(results[i])[4]).replace(',',''))))
                                        }
                                        invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                                        products.push(invoiceProduct);
                                    }
                                    else {
                                        var invoiceProduct = {
                                            proCode: productCode,
                                            proName: product.proName,
                                            proQuantity: Number((Object.values(results[i])[7]).replace(',','')),
                                            proCost: Number((Object.values(results[i])[6]).replace(',','')),
                                            proSale: Math.abs(Number((Object.values(results[i])[4]).replace(',',''))),
                                            proExtraSale: Number((Object.values(results[i])[3]).replace(',','')),
                                            proTaxRate: Number((Object.values(results[i])[2]).replace(',','')),
                                            proTaxValue: (Number((Object.values(results[i])[2]).replace(',','')) == 5 ? Math.abs(( ( ( (Number((Object.values(results[i])[6]).replace(',','')) * Number((Object.values(results[i])[7]).replace(',',''))) - Math.abs(Number((Object.values(results[i])[4]).replace(',',''))) ) * Number((Object.values(results[i])[2]).replace(',','')) ) / 105 )).toFixed(2) : Math.abs((( ( (Number((Object.values(results[i])[6]).replace(',','')) * Number((Object.values(results[i])[7]).replace(',',''))) - Math.abs(Number((Object.values(results[i])[4]).replace(',',''))) ) * Number((Object.values(results[i])[2]).replace(',','')) ) / 114 )).toFixed(2)),
                                            proTotalVat: Math.abs((Number((Object.values(results[i])[6]).replace(',','')) * Number((Object.values(results[i])[7]).replace(',',''))) - Math.abs(Number((Object.values(results[i])[4]).replace(',',''))))
                                        }
                                        invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                                        products.push(invoiceProduct);
                                    }
                                }
                                else {
                                    unfoundProducts.push(productCode)
                                }
                            }).catch(err => {
                                return Promise.reject(err);
                            })
                        }
                        if(unfoundProducts.length == 0) {
                            for(var t = 0; t < products.length; t++) {
                                await StoreModel.findOne({ proCode: products[t].proCode }).then(async (storeProduct) => {
                                    if(storeProduct.proQuantity > products[t].proQuantity) {
                                        var storeProducts = await getStoreProducts(products);
                                    }
                                    if(storeProduct.proQuantity > products[t].proQuantity) {
                                        return Promise.reject(`الكمية المطلوبه اكبر من الموجوده بالمخزن`);
                                    }
                                })
                            }
                            var invoice = await SaleInvoiceModel.findOne({ invoiceNumber: invoiceNumber })
                            if(!invoice) {
                                await SaleInvoiceModel.create(
                                    { invoiceUrl , invoiceNumber , products , invoiceTotal }
                                ).then(saleInvoice => {
                                    res.status(201).json({ data: saleInvoice })
                                }).catch(err => {
                                    res.send(err)
                                })
                            }
                            else {
                                var newProductsInvoice = invoice.products.push(products);
                                await SaleInvoiceModel.findOneAndUpdate(
                                    { invoiceNumber } , { products: newProductsInvoice , $inc:{ invoiceTotal: invoiceTotal } } , { new: true }
                                ).then(newinvoice => {
                                    res.status(200).json({ data: newinvoice })
                                }).catch(err => {
                                    res.send(err)
                                })
                            }
                        }
                        else {
                            next(new ApiError(`لا يوجد صنف بهذا الكود: ${unfoundProducts} قم بادخاله اولا` , 400))
                        }
                    })
                }
            })
            childPython.stderr.on('data' , (data) => {
                console.error(`stderr: ${data}`)
            })
            childPython.on('close' , (code) => {
                console.log(code)
            })
        }
    }),

    addInvoice : asyncHandler(async (req , res ) => {
        const invoiceNumber = req.body.invoiceNumber;
        const products = req.body.products;

        const productsInfo = await getProductInfo(products);

        const storeProducts = await getStoreProducts(productsInfo.productsInfo);
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
            next(new ApiError(`لا توجد فاتورة بهذا الرقم ${id}` , 404))
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
            next(new ApiError(`لا توجد فاتورة بهذا الرقم ${id}` , 404));
        }
        else {
            res.status(200).json({ data: invoice });
        }
    }),

    deleteInvoice : asyncHandler( async (req,res,next) => {
        const { id } = req.params;

        const invoice = await SaleInvoiceModel.findByIdAndDelete({ _id : id });
        if(!invoice) {
            next(new ApiError(`لا توجد فاتورة بهذا الرقم ${id}` , 404));
        }
        else {
            res.status(204).send();
        }
    })
}