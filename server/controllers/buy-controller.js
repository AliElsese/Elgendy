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
        const dd = await createExcelFile(req.file.originalname)
        res.send(dd)
        console.log(dd)
    })
}