const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const SaleInvoiceModel = require('../models/sale-model');
const ProductModel = require('../models/product-model');
const StoreModel = require('../models/store-model');

const { spawn } = require('child_process');

const fs = require('fs');
const csv = require('csv-parser');

const path = require('path');
const excelJS = require('exceljs');

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

const checkStoreQuantity = async (products) => {
    let heheArr = []
    for(var i = 0; i < products.length; i++) {
        await StoreModel.findOne({ proCode: products[i].proCode }).then(product => {
            if(product.proQuantity < products[i].proQuantity) {
                heheArr.push('false')
            }
            else { heheArr.push('true') }
        })
    }
    return heheArr
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
                            var checkStoreQuantity2 = await checkStoreQuantity(products)
                            if(checkStoreQuantity2.includes('false')) {
                                next(new ApiError('الكمية المطلوبة اقل من الموجودة في المخزن' , 400))
                            }
                            else {
                                var storeProducts = await getStoreProducts(products);
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
        const invoices = await SaleInvoiceModel.find({})
        res.status(200).json({ data : invoices })
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
    }),

    getReport : asyncHandler( async (req , res , next) => {
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('سجل المبيعات');
        const filePath = path.resolve("./فواتير البيع");
        const registrationNumber = req.body.registrationNumber;
        const customerName = req.body.customerName;

        var products = [];
        var invoices = await SaleInvoiceModel.find({})
        for(var i = 0; i < invoices.length; i++) {
            for(var x = 0; x < invoices[i].products.length; x++) {
                var product1 = {
                    invoiceNumber: invoices[i].invoiceNumber,
                    registrationNumber: registrationNumber,
                    customerName: customerName,
                    proCode: invoices[i].products[x].proCode,
                    proName: invoices[i].products[x].proName,
                    proQuantity: invoices[i].products[x].proQuantity,
                    proCost: invoices[i].products[x].proCost,
                    proSale: invoices[i].products[x].proSale,
                    proTaxValue: invoices[i].products[x].proTaxValue,
                    proTotalVat: invoices[i].products[x].proTotalVat,
                }
                products.push(product1);
            }
        }

        // res.send(products)
        workSheet.columns = [
            { header: 'رقم الفاتورة' , key: 'invoiceNumber' , width: 15 },
            { header: 'رقم التسجيل' , key: 'registrationNumber' , width: 15 },
            { header: 'اسم العميل' , key: 'customerName' , width: 15 },
            { header: 'رقم الصنف' , key: 'proCode' , width: 15 },
            { header: 'اسم الصنف' , key: 'proName' , width: 50 },
            { header: 'الكمية' , key: 'proQuantity' , width: 15 },
            { header: 'السعر' , key: 'proCost' , width: 15 },
            { header: 'الخصم' , key: 'proSale' , width: 15 },
            { header: 'الضريبة' , key: 'proTaxValue' , width: 15 },
            { header: 'الاجمالي' , key: 'proTotalVat' , width: 15 }
        ]

        products.forEach(product => {
            workSheet.addRow(product);
        });

        workSheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
        });

        try {
            const data = await workBook.xlsx.writeFile( filePath + `/invoice.xlsx`)
            .then(() => {
                res.send({
                status: "success",
                message: "تم تجهيز التقرير بنجاح",
                path: `${filePath}/invoices.xlsx`,
                });
            });
        }
        catch (err) {
            res.send({
                status: "error",
                message: "Something went wrong",
            });
        }
    }),

    getSingleReport : asyncHandler( async (req , res , next) => {
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('سجل المبيعات');
        const filePath = path.resolve("./فواتير البيع");
        const registrationNumber = req.body.registrationNumber;
        const customerName = req.body.customerName;

        var products = [];
        var invoice = await SaleInvoiceModel.findOne({ _id: req.body.invoiceId })
        
            for(var i = 0; i < invoice.products.length; i++) {
                var product1 = {
                    invoiceNumber: invoice.invoiceNumber,
                    registrationNumber: registrationNumber,
                    customerName: customerName,
                    proCode: invoice.products[i].proCode,
                    proName: invoice.products[i].proName,
                    proQuantity: invoice.products[i].proQuantity,
                    proCost: invoice.products[i].proCost,
                    proSale: invoice.products[i].proSale,
                    proTaxValue: invoice.products[i].proTaxValue,
                    proTotalVat: invoice.products[i].proTotalVat,
                }
                products.push(product1);
            }
        

        // res.send(products)
        workSheet.columns = [
            { header: 'رقم الفاتورة' , key: 'invoiceNumber' , width: 15 },
            { header: 'رقم التسجيل' , key: 'registrationNumber' , width: 15 },
            { header: 'اسم العميل' , key: 'customerName' , width: 15 },
            { header: 'رقم الصنف' , key: 'proCode' , width: 15 },
            { header: 'اسم الصنف' , key: 'proName' , width: 50 },
            { header: 'الكمية' , key: 'proQuantity' , width: 15 },
            { header: 'السعر' , key: 'proCost' , width: 15 },
            { header: 'الخصم' , key: 'proSale' , width: 15 },
            { header: 'الضريبة' , key: 'proTaxValue' , width: 15 },
            { header: 'الاجمالي' , key: 'proTotalVat' , width: 15 }
        ]

        products.forEach(product => {
            workSheet.addRow(product);
        });

        workSheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
        });

        try {
            const data = await workBook.xlsx.writeFile( filePath + `/singleInvoice.xlsx`)
            .then(() => {
                res.send({
                status: "success",
                message: "تم تجهيز التقرير بنجاح",
                path: `${filePath}/singleInvoice.xlsx`,
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