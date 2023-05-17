const { v4: uuidv4 } = require('uuid');
const path = require('path');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const BuyInvoiceModel = require('../models/buy-model');
const ProductModel = require('../models/product-model');
const StoreModel = require('../models/store-model');

const fs = require('fs');

const excelJS = require('exceljs');
const pdfToExcel = require('pdf-to-excel');
const reader = require('xlsx')

const checkProductCode = async (products) => {
    var productStatus = {
        status: [],
        codesFound: [],
        codesNotFound: []
    };
    for(let i = 0; i < products.length; i++) {
        var proCode = Object.values(products[i])[1];
        var product = await ProductModel.findOne({ proCode });
        if(!product) {
            productStatus.status.push('false');
            productStatus.codesNotFound.push(proCode);
        }
        else {
            productStatus.status.push('true');
            productStatus.codesFound.push(proCode);
        }
    }
    return productStatus;
}

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
        } , { new: true });
        if(!product || product == undefined) {
            storeProducts.push(products[i]);
        }
    }
    return storeProducts;
}

module.exports = {
    buyInvoiceGenerate: asyncHandler(async (req , res , next) => {
        // const file = reader.readFile(req.file.path);

        // let data = [];
        // const sheets = file.SheetNames;

        // for(let i = 0; i < sheets.length; i++) {
        //     const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
        //     temp.forEach((res) => {
        //         data.push(res)
        //     })
        // }

        // for(let x = 0; x < data.length; x++) {
        //     const product = await ProductModel.findOne({ proCode: data[x].proCode });
        //     if(!product) {
        //         const productInfo = {
        //             proCode: data[x].proCode,
        //             proName: data[x].proName,
        //             proPackaging: data[x].proPackaging,
        //             proPrice: data[x].proPrice,
        //             isFixed: false
        //         }
        //         const insertedProduct = await ProductModel.create(productInfo);
        //     }
        // }
        // res.send('done')
        await pdfToExcel.genXlsx(req.file.path , __dirname + `/excelfrompdf.xlsx`)
        const excelFile = reader.readFile(__dirname + `/excelfrompdf.xlsx`)
        let excelFileData = []
        const sheets = excelFile.SheetNames
        for(let i = 0; i < sheets.length; i++) {
            const temp = reader.utils.sheet_to_json(
                excelFile.Sheets[excelFile.SheetNames[i]])
            temp.forEach((res) => {
                excelFileData.push(res)
            })
        }
        // التاريخ
        const d = new Date();
        const invoiceDate = d.toLocaleDateString('en-GB').replaceAll('/' , '-');
        // invoice Number
        const invoiceNumber = excelFileData[0].__EMPTY_5;
        // check invoice number in database
        var oldInvoice = await BuyInvoiceModel.findOne({ invoiceNumber: invoiceNumber });
        if(oldInvoice) {
            next(new ApiError(`رقم الفاتورة مسجل من قبل` , 400));
        }
        else {
            function startsWithNumber(str) {
                return /^\d/.test(str);
            }
            var products = [];
            var invoiceProducts = [];
            var invoiceTotal = 0;
            for(let y = 0; y < excelFileData.length; y++) {
                if(excelFileData[y].__EMPTY_40 != undefined) continue;
                if(Object.values(excelFileData[y])[2] === undefined) continue;
                if(!startsWithNumber(Object.values(excelFileData[y])[1])) continue;
                if((Object.values(excelFileData[y])[Object.keys(excelFileData[y]).length - 1]).startsWith('012')) continue;
                if(startsWithNumber(Object.values(excelFileData[y])[Object.keys(excelFileData[y]).length - 1]))
                products.push(excelFileData[y]);
            }
            const productsExisting = await checkProductCode(products);
            // console.log(products)
            if(productsExisting.status.includes('false')) {
                res.status(404).json({
                    message: `${productsExisting.codesNotFound} قم باضافة الاصناف التابعه لهذه الاكواد`,
                    data: productsExisting.codesNotFound
                })
            }
            else {
                for(let x = 0; x < products.length; x++) {
                    var proCode = Object.values(products[x])[1];
                    var invoiceProductInfo = await ProductModel.findOne({ proCode });
                    if(isNaN((Object.values(products[x])[Object.keys(products[x]).length - 7]))) {
                        // console.log('7')
                        if(isNaN(Object.values(products[x])[Object.keys(products[x]).length - 3])) {
                            // console.log('hi1')
                            if(isNaN(Object.values(products[x])[Object.keys(products[x]).length - 9])) {
                                var invoiceProduct = {
                                    proCode: proCode,
                                    proName: invoiceProductInfo.proName,
                                    proPackaging: invoiceProductInfo.proPackaging,
                                    package: Number((Object.values(products[x])[Object.keys(products[x]).length - 12]).replace(',','').trim()),
                                    proPrice: Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()),
                                    proQuantity: Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()),
                                    proSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim())),
                                    proExtraSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 2]).replace(',','').trim())),
                                    proTaxRate: Number((Object.values(products[x])[Object.keys(products[x]).length - 1])),
                                    proTaxValue: (Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) == 5 ? Number(( ( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 105 ).toFixed(2)) : Number((( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 114 ).toFixed(2))),
                                    proTotalVat: (((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))))
                                }
                                
                                invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                                invoiceProducts.push(invoiceProduct);
                            }
                            else {
                                var invoiceProduct = {
                                    proCode: proCode,
                                    proName: invoiceProductInfo.proName,
                                    proPackaging: invoiceProductInfo.proPackaging,
                                    package: Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()),
                                    proPrice: Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim()),
                                    proQuantity: Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()),
                                    proSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim())),
                                    proExtraSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 2]).replace(',','').trim())),
                                    proTaxRate: Number((Object.values(products[x])[Object.keys(products[x]).length - 1])),
                                    proTaxValue: (Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) == 5 ? Number(( ( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 105 ).toFixed(2)) : Number((( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 114 ).toFixed(2))),
                                    proTotalVat: (((Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))))
                                }
                                
                                invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                                invoiceProducts.push(invoiceProduct);
                            }
                        }
                        else {
                            // console.log('hi2')
                            if(isNaN(Object.values(products[x])[Object.keys(products[x]).length - 9])) {
                                var invoiceProduct = {
                                    proCode: proCode,
                                    proName: invoiceProductInfo.proName,
                                    proPackaging: invoiceProductInfo.proPackaging,
                                    package: Number((Object.values(products[x])[Object.keys(products[x]).length - 12]).replace(',','').trim()),
                                    proPrice: Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()),
                                    proQuantity: Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()),
                                    proSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim())),
                                    proExtraSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 2]).replace(',','').trim())),
                                    proTaxRate: Number((Object.values(products[x])[Object.keys(products[x]).length - 1])),
                                    proTaxValue: (Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) == 5 ? Number(( ( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 105 ).toFixed(2)) : Number((( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 114 ).toFixed(2))),
                                    proTotalVat: (((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))))
                                }
                                
                                invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                                invoiceProducts.push(invoiceProduct);
                            }
                            else {
                                var invoiceProduct = {
                                    proCode: proCode,
                                    proName: invoiceProductInfo.proName,
                                    proPackaging: invoiceProductInfo.proPackaging,
                                    package: Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()),
                                    proPrice: Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim()),
                                    proQuantity: Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()),
                                    proSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim())),
                                    proExtraSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 2]).replace(',','').trim())),
                                    proTaxRate: Number((Object.values(products[x])[Object.keys(products[x]).length - 1])),
                                    proTaxValue: (Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) == 5 ? Number(( ( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 105 ).toFixed(2)) : Number((( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 114 ).toFixed(2))),
                                    proTotalVat: (((Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))))
                                }
                                
                                invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                                invoiceProducts.push(invoiceProduct);
                            }
                        }
                    }
                    else if(isNaN((Object.values(products[x])[Object.keys(products[x]).length - 8]))) {
                        // console.log('8')
                        if(isNaN(Object.values(products[x])[Object.keys(products[x]).length - 3])) {
                            // console.log('hi1')
                            if(isNaN(Object.values(products[x])[Object.keys(products[x]).length - 9])) {
                                var invoiceProduct = {
                                    proCode: proCode,
                                    proName: invoiceProductInfo.proName,
                                    proPackaging: invoiceProductInfo.proPackaging,
                                    package: Number((Object.values(products[x])[Object.keys(products[x]).length - 12]).replace(',','').trim()),
                                    proPrice: Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()),
                                    proQuantity: Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()),
                                    proSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim())),
                                    proExtraSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 2]).replace(',','').trim())),
                                    proTaxRate: Number((Object.values(products[x])[Object.keys(products[x]).length - 1])),
                                    proTaxValue: (Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) == 5 ? Number(( ( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 105 ).toFixed(2)) : Number((( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 114 ).toFixed(2))),
                                    proTotalVat: (((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))))
                                }
                                
                                invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                                invoiceProducts.push(invoiceProduct);
                            }
                            else {
                                var invoiceProduct = {
                                    proCode: proCode,
                                    proName: invoiceProductInfo.proName,
                                    proPackaging: invoiceProductInfo.proPackaging,
                                    package: Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()),
                                    proPrice: Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()),
                                    proQuantity: Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()),
                                    proSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim())),
                                    proExtraSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 2]).replace(',','').trim())),
                                    proTaxRate: Number((Object.values(products[x])[Object.keys(products[x]).length - 1])),
                                    proTaxValue: (Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) == 5 ? Number(( ( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 105 ).toFixed(2)) : Number((( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 114 ).toFixed(2))),
                                    proTotalVat: (((Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))))
                                }
                                
                                invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                                invoiceProducts.push(invoiceProduct);
                            }
                        }
                        else {
                            // console.log('hi2')
                            if(isNaN(Object.values(products[x])[Object.keys(products[x]).length - 9])) {
                                var invoiceProduct = {
                                    proCode: proCode,
                                    proName: invoiceProductInfo.proName,
                                    proPackaging: invoiceProductInfo.proPackaging,
                                    package: Number((Object.values(products[x])[Object.keys(products[x]).length - 12]).replace(',','').trim()),
                                    proPrice: Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()),
                                    proQuantity: Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()),
                                    proSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim())),
                                    proExtraSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 2]).replace(',','').trim())),
                                    proTaxRate: Number((Object.values(products[x])[Object.keys(products[x]).length - 1])),
                                    proTaxValue: (Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) == 5 ? Number(( ( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 105 ).toFixed(2)) : Number((( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 114 ).toFixed(2))),
                                    proTotalVat: (((Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))))
                                }
                                
                                invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                                invoiceProducts.push(invoiceProduct);
                            }
                            else {
                                var invoiceProduct = {
                                    proCode: proCode,
                                    proName: invoiceProductInfo.proName,
                                    proPackaging: invoiceProductInfo.proPackaging,
                                    package: Number((Object.values(products[x])[Object.keys(products[x]).length - 11]).replace(',','').trim()),
                                    proPrice: Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()),
                                    proQuantity: Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()),
                                    proSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim())),
                                    proExtraSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 2]).replace(',','').trim())),
                                    proTaxRate: Number((Object.values(products[x])[Object.keys(products[x]).length - 1])),
                                    proTaxValue: (Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) == 5 ? Number(( ( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 105 ).toFixed(2)) : Number((( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 114 ).toFixed(2))),
                                    proTotalVat: (((Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 10]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))))
                                }
                                
                                invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                                invoiceProducts.push(invoiceProduct);
                            }
                        }
                    }
                    else {
                        // console.log('3')
                        if(isNaN(Object.values(products[x])[Object.keys(products[x]).length - 3])) {
                            // console.log('hi1')
                            var invoiceProduct = {
                                proCode: proCode,
                                proName: invoiceProductInfo.proName,
                                proPackaging: invoiceProductInfo.proPackaging,
                                package: Number((Object.values(products[x])[Object.keys(products[x]).length - 9]).replace(',','').trim()),
                                proPrice: Number((Object.values(products[x])[Object.keys(products[x]).length - 7]).replace(',','').trim()),
                                proQuantity: Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim()),
                                proSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim())),
                                proExtraSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 2]).replace(',','').trim())),
                                proTaxRate: Number((Object.values(products[x])[Object.keys(products[x]).length - 1])),
                                proTaxValue: (Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) == 5 ? Number(( ( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 7]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 105 ).toFixed(2)) : Number((( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 7]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 114 ).toFixed(2))),
                                proTotalVat: (((Number((Object.values(products[x])[Object.keys(products[x]).length - 7]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 4]).replace(',','').trim()))))
                            }
                            // console.log(invoiceProduct)
                            invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                            invoiceProducts.push(invoiceProduct);
                        }
                        else {
                            // console.log('hi2')
                            var invoiceProduct = {
                                proCode: proCode,
                                proName: invoiceProductInfo.proName,
                                proPackaging: invoiceProductInfo.proPackaging,
                                package: Number((Object.values(products[x])[Object.keys(products[x]).length - 8]).replace(',','').trim()),
                                proPrice: Number((Object.values(products[x])[Object.keys(products[x]).length - 6]).replace(',','').trim()),
                                proQuantity: Number((Object.values(products[x])[Object.keys(products[x]).length - 7]).replace(',','').trim()),
                                proSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim())),
                                proExtraSale: Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 2]).replace(',','').trim())),
                                proTaxRate: Number((Object.values(products[x])[Object.keys(products[x]).length - 1])),
                                proTaxValue: (Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) == 5 ? Number(( ( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 6]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 7]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 105 ).toFixed(2)) : Number((( ( ((Number((Object.values(products[x])[Object.keys(products[x]).length - 6]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 7]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))) ) * Number((Object.values(products[x])[Object.keys(products[x]).length - 1])) ) / 114 ).toFixed(2))),
                                proTotalVat: (((Number((Object.values(products[x])[Object.keys(products[x]).length - 6]).replace(',','').trim())) * (Number((Object.values(products[x])[Object.keys(products[x]).length - 7]).replace(',','').trim()))) - (Math.abs(Number((Object.values(products[x])[Object.keys(products[x]).length - 3]).replace(',','').trim()))))
                            }
                            // console.log(invoiceProduct)
                            invoiceTotal = invoiceTotal + invoiceProduct.proTotalVat;
                            invoiceProducts.push(invoiceProduct);
                        }
                    }
                }
                // console.log(invoiceProducts)
                // console.log(invoiceTotal)
                const storeProducts = await getStoreProducts(invoiceProducts);
                if(storeProducts.length != 0) { await StoreModel.create(storeProducts); }
                const buyInvoice = await BuyInvoiceModel.create({
                    invoiceNumber , products: invoiceProducts , invoiceTotal , invoiceDate
                })
                res.status(201).json({ data: buyInvoice })
            }
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
            { header: 'الوحدة' , key: 'proPackaging' , width: 25 },
            { header: 'العبوة' , key: 'package' , width: 15 },
            { header: 'السعر' , key: 'proPrice' , width: 15 },
            { header: 'الكمية' , key: 'proQuantity' , width: 15 },
            { header: 'الخصم' , key: 'proSale' , width: 15 },
            { header: 'الخصم الاضافي' , key: 'proExtraSale' , width: 15 },
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
                    proPackaging: invoices[i].products[x].proPackaging,
                    package: invoices[i].products[x].package,
                    proPrice: invoices[i].products[x].proPrice,
                    proQuantity: invoices[i].products[x].proQuantity,
                    proSale: invoices[i].products[x].proSale,
                    proExtraSale: invoices[i].products[x].proExtraSale,
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