const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const SaleInvoiceModel = require('../models/sale-model');
const ProductModel = require('../models/product-model');
const StoreModel = require('../models/store-model');
const CompanyModel = require('../models/company-model');

const { spawn } = require('child_process');

const fs = require('fs');
const csv = require('csv-parser');

const path = require('path');
const excelJS = require('exceljs');

const getCompanyInfo = async(companyId) => {
    const company = await CompanyModel.find({ _id: companyId })
    return company;
}

const updateStoreProducts = async (products) => {
    let storeProducts = []
    for(var i = 0; i < products.length; i++) {
        var product = await StoreModel.findOneAndUpdate({ proCode: products[i].proCode } , {
            $inc:{ proQuantity: -(products[i].proQuantity) },
        } , { new: true });
        storeProducts.push(product)
    }
    return storeProducts;
}

const getProductTotal = async (products) => {
    var invoice = {
        productsInfo : [],
        invoiceTotal : 0,
        invoiceTotalSale : 0,
        invoiceTotalTax : 0,
        invoiceTotalVat : 0
    }
    for(var i = 0; i < products.length; i++) {
        var product = await ProductModel.findOne({ proCode: products[i].proCode });
        var productInfo = {
            proCode: product.proCode,
            proName: product.proName,
            proPackaging: product.proPackaging,
            proPrice: product.proPrice,
            proQuantity: products[i].proQuantity,
            proSale: Number((product.proPrice * products[i].proQuantity * 0.1175).toFixed(2)),
            proTaxRate: product.proTaxRate,
            proTaxValue: (product.proTaxRate != 0 ? Number((((products[i].proQuantity * product.proPrice) - (product.proPrice * products[i].proQuantity * 0.1175)) * product.proTaxRate).toFixed(2)) : 0),
            proTotalVat: Number(((products[i].proQuantity * product.proPrice) - (product.proPrice * products[i].proQuantity * 0.1175)).toFixed(2)),
        }
        invoice.invoiceTotal = invoice.invoiceTotal + productInfo.proTotalVat;
        invoice.invoiceTotalSale = invoice.invoiceTotalSale + productInfo.proSale;
        invoice.invoiceTotalTax = invoice.invoiceTotalTax + productInfo.proTaxValue;
        invoice.productsInfo.push(productInfo);
    }
    invoice.invoiceTotalVat = invoice.invoiceTotal - invoice.invoiceTotalSale + invoice.invoiceTotalTax
    return invoice;
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
        // بيانات الشركة
        const company = await getCompanyInfo(req.body.companyId);
        // بيانات العميل
        const clientName = req.body.clientName;
        const clientAddress = req.body.clientAddress;
        const registrationNumber = req.body.registrationNumber;
        // التاريخ
        const d = new Date();
        const invoiceDate = d.toLocaleDateString();
        // رقم الفاتورة
        const invoiceNumber = req.body.invoiceNumber;
        // الاصناف
        const products = req.body.products;
        // تعديل كميات المخزن
        const storeProducts = await updateStoreProducts(products);
        // ايجاد الاجمالي
        const invoiceTotal = await getProductTotal(products);
        // بيانات الفاتورة
        const invoiceData = {
            companyName: company[0].companyName,
            companyScope: company[0].companyScope,
            companyBranche: company[0].companyBranche,
            companyAddress: company[0].companyAddress,
            companyTaxNumber: company[0].companyTaxNumber,
            clientName: clientName,
            clientAddress: clientAddress,
            registrationNumber: registrationNumber,
            invoiceDate: invoiceDate,
            invoiceNumber: invoiceNumber,
            products: invoiceTotal.productsInfo,
            invoiceTotal: invoiceTotal.invoiceTotal,
            invoiceTotalSale: invoiceTotal.invoiceTotalSale,
            invoiceTotalTax: invoiceTotal.invoiceTotalTax,
            invoiceTotalVat: invoiceTotal.invoiceTotalVat
        }

        const invoiceProducts = await SaleInvoiceModel.create(invoiceData);
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
        // بيانات الشركة
        const company = await getCompanyInfo(req.body.companyId);
        const companyName = company[0].companyName;
        const companyScope = company[0].companyScope;
        const companyBranche = company[0].companyBranche;
        const companyAddress = company[0].companyAddress;
        const companyTaxNumber = company[0].companyTaxNumber;
        // بيانات العميل
        const clientName = req.body.clientName;
        const clientAddress = req.body.clientAddress;
        const registrationNumber = req.body.registrationNumber;
        // بيانات الفاتورة
        const invoiceData = {
            companyName: company[0].companyName,
            companyScope: company[0].companyScope,
            companyBranche: company[0].companyBranche,
            companyAddress: company[0].companyAddress,
            companyTaxNumber: company[0].companyTaxNumber,
            clientName: clientName,
            clientAddress: clientAddress,
            registrationNumber: registrationNumber
        }

        const invoiceProducts = await SaleInvoiceModel.findByIdAndUpdate(
            { _id : id } , { companyName , companyScope , companyBranche , companyAddress , companyTaxNumber , clientName , clientAddress , registrationNumber } , { new : true }
        )
        if(!invoiceProducts) {
            next(new ApiError(`لا توجد فاتورة بهذا الرقم ${id}` , 404));
        }
        else {
            res.status(200).json({ data: invoiceProducts });
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
        const d = new Date();
        const dateNumber = d.toLocaleDateString().replaceAll('/' , '-')
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('سجل المبيعات');
        const filePath = path.resolve("./uploads/فواتير البيع");

        var invoices = await SaleInvoiceModel.find({})

        workSheet.columns = [
            { header: 'رقم الفاتورة' , key: 'invoiceNumber' , width: 15 },
            { header: 'التاريخ' , key: 'invoiceDate' , width: 15 },
            { header: 'رقم التسجيل' , key: 'registrationNumber' , width: 15 },
            { header: 'اسم العميل' , key: 'clientName' , width: 15 },
            { header: 'رقم الصنف' , key: 'proCode' , width: 15 },
            { header: 'اسم الصنف' , key: 'proName' , width: 30 },
            { header: 'السعر' , key: 'proPrice' , width: 15 },
            { header: 'الكمية' , key: 'proQuantity' , width: 15 },
            { header: 'الخصم' , key: 'proSale' , width: 15 },
            { header: 'الضريبة' , key: 'proTaxValue' , width: 15 },
            { header: 'الاجمالي' , key: 'proTotalVat' , width: 15 }
        ]

        var invoiceItems = []
        for(var i = 0; i < invoices.length; i++) {
            console.log(invoices[i].invoiceNumber)
            for(var x = 0; x < invoices[i].products.length; x++) {
                console.log(invoices[i].products[x].proCode)
                var invoice = {
                    invoiceNumber: invoices[i].invoiceNumber,
                    invoiceDate: invoices[i].invoiceDate,
                    registrationNumber: invoices[i].registrationNumber,
                    clientName: invoices[i].clientName,
                    proCode: invoices[i].products[x].proCode,
                    proName: invoices[i].products[x].proName,
                    proPrice: invoices[i].products[x].proPrice,
                    proQuantity: invoices[i].products[x].proQuantity,
                    proSale: invoices[i].products[x].proSale,
                    proTaxValue: invoices[i].products[x].proTaxValue,
                    proTotalVat: invoices[i].products[x].proTotalVat,
                }
                invoiceItems.push(invoice)
            }
        }

        invoiceItems.forEach(invoice => {
            workSheet.addRow(invoice);
        });

        workSheet.getRow(1).eachCell(cell => {
            cell.font = { bold: true };
        });

        try {
            const data = await workBook.xlsx.writeFile( filePath + `/invoice-${uuidv4()}(${dateNumber}).xlsx`)
            .then(() => {
                res.send({
                status: "success",
                message: "تم تجهيز التقرير بنجاح"
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