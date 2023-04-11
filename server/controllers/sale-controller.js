const path = require('path');
const { v4: uuidv4 } = require('uuid');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const SaleInvoiceModel = require('../models/sale-model');
const ProductModel = require('../models/product-model');
const StoreModel = require('../models/store-model');
const CompanyModel = require('../models/company-model');

const { spawn } = require('child_process');

const pdf = require('pdf-creator-node');
const fs = require('fs');

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
        var product = await StoreModel.findOne({ proCode: products[i].proCode });
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
        invoice.invoiceTotal = Number((invoice.invoiceTotal + productInfo.proTotalVat).toFixed(2));
        invoice.invoiceTotalSale = Number((invoice.invoiceTotalSale + productInfo.proSale).toFixed(2));
        invoice.invoiceTotalTax = Number((invoice.invoiceTotalTax + productInfo.proTaxValue).toFixed(2));
        invoice.productsInfo.push(productInfo);
    }
    invoice.invoiceTotalVat = Number((invoice.invoiceTotal - invoice.invoiceTotalSale + invoice.invoiceTotalTax).toFixed(2))
    return invoice;
}

module.exports = {
    addInvoice : asyncHandler(async (req , res ) => {
        // بيانات الشركة
        const company = await getCompanyInfo(req.body.companyId);
        // بيانات العميل
        const clientName = req.body.clientName;
        const clientAddress = req.body.clientAddress;
        const registrationNumber = req.body.registrationNumber;
        // التاريخ
        const d = new Date();
        const invoiceDate = d.toLocaleDateString('en-GB').replaceAll('/' , '-')
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
        const dateNumber = d.toLocaleDateString('en-GB').replaceAll('/' , '-')
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
        const d = new Date();
        const dateNumber = d.toLocaleDateString('en-GB').replaceAll('/' , '-')
        const invoice = await SaleInvoiceModel.findById({ _id: req.body.invoiceId }).lean();
        const html = fs.readFileSync(path.join(__dirname , './template.html') , 'utf8')
        var options = {
            format: "A4",
            orientation: "portrait",
            // width: "210mm",
            // height: "297mm"
        };
        var document = {
            html: html,
            data: {
              invoice: invoice,
            },
            path: `./uploads/فواتير البيع/invoice(${invoice.invoiceNumber})-(${dateNumber}).pdf`,
            type: "pdf",
        };
        pdf.create(document, options)
            .then((response) => {
                res.status(200).json({ data: (response.filename).replaceAll('\\' , '/') })
            })
            .catch((error) => {
                next(new ApiError(`${error}` , 500))
            });
    })
}