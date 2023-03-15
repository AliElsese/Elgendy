const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const BuyInvoiceModel = require('../models/buy-model');

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
        
    })
}