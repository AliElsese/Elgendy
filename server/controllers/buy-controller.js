const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const BuyInvoiceModel = require('../models/buy-model');
const ProductModel = require('../models/product-model');
const StoreModel = require('../models/store-model');

const { spawn } = require('child_process');

const fs = require('fs');
const csv = require('csv-parser');

const path = require('path');
const excelJS = require('exceljs');
const pdfToExcel = require('pdf-to-excel');
const reader = require('xlsx')

const getProductInfo = async (products) => {
    var invoice = {
        productsInfo : [],
        invoiceTotal : 0
    }
    for(var i = 0; i < products.length; i++) {
        var product = await ProductModel.findOne({ proCode: products[i].proCode });
        var productInfo = {
            proCode: product.proCode,
            proName: product.proName,
            proPackaging: product.proPackaging,
            proPrice: products[i].proPrice,
            proQuantity: products[i].proQuantity,
            proSale: products[i].proSale,
            proTaxRate: products[i].proTaxRate,
            proTaxValue: (products[i].proTaxRate == '5' ? Math.abs(( ( ( (products[i].proPrice * products[i].proQuantity) - products[i].proSale ) * products[i].proTaxRate ) / 105 )).toFixed(2) : Math.abs((( ( (products[i].proPrice * products[i].proQuantity) - products[i].proSale ) * products[i].proTaxRate ) / 114 )).toFixed(2)),
            proTotalVat: Math.abs((products[i].proPrice * products[i].proQuantity) - products[i].proSale),
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
            proPackaging: products[i].proPackaging,
            $inc:{ proQuantity: products[i].proQuantity },
            proPrice: products[i].proPrice,
            proTaxRate: products[i].proTaxRate,
        } , { new: true });
        if(!product || product == undefined) {
            storeProducts.push(products[i]);
        }
    }
    return storeProducts;
}

module.exports = {
    createBuyInvoice : asyncHandler(async (req , res , next) => {
        // التاريخ
        const d = new Date();
        const invoiceDate = d.toLocaleDateString('en-GB').replaceAll('/' , '-')

        await pdfToExcel.genXlsx(req.file.path , __dirname + `/excelfrompdf.xlsx`)
        const excelFile = reader.readFile(__dirname + `/excelfrompdf.xlsx`)
        let data = []
  
        const sheets = excelFile.SheetNames
        
        for(let i = 0; i < sheets.length; i++)
        {
        const temp = reader.utils.sheet_to_json(
            excelFile.Sheets[excelFile.SheetNames[i]])
        temp.forEach((res) => {
            data.push(res)
        })
        }
        // invoice Number
        const invoiceNumber = data[0].__EMPTY_5;
        var oldInvoice = await BuyInvoiceModel.findOne({ invoiceNumber: invoiceNumber })
        if(oldInvoice) {
            next(new ApiError(`رقم الفاتورة مسجل من قبل` , 400))
        }
        else {
            var invoiceUrl = req.file.path;
            var results = []
            var products = []
            var unfoundProducts = []
            var invoiceTotal = 0
            const childPython = spawn('python' , [path.resolve('./pdfreader.py') , `./${invoiceUrl}`])
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
                                            proPrice: Number((Object.values(results[i])[7]).replace(',','')),
                                            proQuantity: Number((Object.values(results[i])[8]).replace(',','')),
                                            proSale: Math.abs(Number((Object.values(results[i])[4]).replace(',',''))),
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
                                            proPrice: Number((Object.values(results[i])[6]).replace(',','')),
                                            proQuantity: Number((Object.values(results[i])[7]).replace(',','')),
                                            proSale: Math.abs(Number((Object.values(results[i])[4]).replace(',',''))),
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
                            var storeProducts = await getStoreProducts(products);
                            if(storeProducts.length != 0) { await StoreModel.create(storeProducts); }
                            var invoice = await BuyInvoiceModel.findOne({ invoiceNumber: invoiceNumber })
                            if(!invoice) {
                                await BuyInvoiceModel.create(
                                    { invoiceUrl , invoiceNumber , products , invoiceTotal , invoiceDate }
                                ).then(buyInvoice => {
                                    res.status(201).json({ data: buyInvoice })
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
        // التاريخ
        const d = new Date();
        const invoiceDate = d.toLocaleDateString('en-GB').replaceAll('/' , '-')
        // رقم الفاتورة
        const invoiceNumber = req.body.invoiceNumber;
        // الاصناف
        const products = req.body.products;

        const productsInfo = await getProductInfo(products);

        const storeProducts = await getStoreProducts(productsInfo.productsInfo);
        if(storeProducts.length != 0) await StoreModel.create(storeProducts);

        const invoiceProducts = await BuyInvoiceModel.create({ invoiceNumber , products: productsInfo.productsInfo , invoiceDate: invoiceDate , invoiceTotal: productsInfo.invoiceTotal });
        res.status(201).json({ data: invoiceProducts });
    }),

    getInvoices : asyncHandler(async (req , res) => {
        const invoices = await BuyInvoiceModel.find({})
        res.status(200).json({ data : invoices })
    }),

    getInvoice : asyncHandler( async (req,res,next) => {
        const { id } = req.params

        const invoice = await BuyInvoiceModel.findById(id)
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

        const invoice = await BuyInvoiceModel.findByIdAndUpdate(
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

        const invoice = await BuyInvoiceModel.findByIdAndDelete({ _id : id });
        if(!invoice) {
            next(new ApiError(`لا توجد فاتورة بهذا الرقم ${id}` , 404));
        }
        else {
            res.status(204).send();
        }
    }),

    getReport : asyncHandler( async (req , res , next) => {
        const d = new Date();
        const dateNumber = d.toLocaleDateString('en-GB').replaceAll('/' , '-')
        const workBook = new excelJS.Workbook();
        const workSheet = workBook.addWorksheet('سجل المشتريات');
        const filePath = path.resolve("./uploads/فواتير الشراء");

        var invoices = await BuyInvoiceModel.find({})

        workSheet.columns = [
            { header: 'رقم الفاتورة' , key: 'invoiceNumber' , width: 15 },
            { header: 'التاريخ' , key: 'invoiceDate' , width: 15 },
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
            for(var x = 0; x < invoices[i].products.length; x++) {
                var invoice = {
                    invoiceNumber: invoices[i].invoiceNumber,
                    invoiceDate: invoices[i].invoiceDate,
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
                message: err,
            });
        }
    }),
}