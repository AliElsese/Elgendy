const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const StoreModel = require('../models/store-model');
const ProductModel = require('../models/product-model');

const getProductInfo = async (productCode) => {
    var product = await ProductModel.findOne({ proCode: productCode });
    return product.proName;
}

module.exports = {
    addStoreProduct : asyncHandler(async (req , res , next) => {
        const productName = await getProductInfo(req.body.proCode);
        const productInfo = {
            proCode: req.body.proCode,
            proName: productName,
            proQuantity: req.body.proQuantity,
            proCost: req.body.proCost,
            proSale: req.body.proSale,
            proExtraSale: req.body.proExtraSale,
            proTaxRate: req.body.proTaxRate,
            proTaxValue: (req.body.proTaxRate == '5' ? Math.abs(( ( ( (req.body.proCost * req.body.proQuantity) - req.body.proSale ) * req.body.proTaxRate ) / 105 )).toFixed(2) : Math.abs((( ( (req.body.proCost * req.body.proQuantity) - req.body.proSale ) * req.body.proTaxRate ) / 114 )).toFixed(2)),
            proTotalVat: Math.abs((req.body.proCost * req.body.proQuantity) - req.body.proSale),
        }

        const product = await StoreModel.create(productInfo);
        res.status(201).json({ data: product });
    }),

    updateStoreProduct : asyncHandler(async (req , res , next) => {
        const proQuantity = req.body.proQuantity;
        const proCost = req.body.proCost;
        const proSale = req.body.proSale;
        const proExtraSale = req.body.proExtraSale;
        const proTaxRate = req.body.proTaxRate;
        const proTaxValue = req.body.proTaxValue;
        const proTotalVat = req.body.proTotalVat

        const product = await StoreModel.findByIdAndUpdate({ _id: req.params.id } , { proQuantity , proCost , proSale , proExtraSale , proTaxRate , proTaxValue , proTotalVat } , { new: true });
        if(!product) {
            next(new ApiError(`No Product For This Id ${id}` , 404));
        }
        else {
            res.status(200).json({ data: product });
        }
    }),

    getStoreProducts : asyncHandler(async (req , res , next) => {
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 20
        const skip = (page - 1) * limit

        const storeProducts = await StoreModel.find({})
        res.status(200).json({
            results : storeProducts.length,
            page : page,
            data : storeProducts.slice(skip,limit*page)
        })
    }),

    getStoreProduct : asyncHandler(async (req , res , next) => {
        const { id } = req.params

        const product = await StoreModel.findById(id)
        if(!product) {
            next(new ApiError(`No Product For This Id ${id}` , 404))
        }
        else {
            res.status(200).json({ data: product })
        }
    }),

    deleteStoreProduct : asyncHandler( async (req,res,next) => {
        const { id } = req.params;

        const product = await StoreModel.findByIdAndDelete({ _id : id });
        if(!product) {
            next(new ApiError(`No Product For This Id ${id}` , 404));
        }
        else {
            res.status(204).send();
        }
    })
}