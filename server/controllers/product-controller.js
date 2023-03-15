const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ProductModel = require('../models/product-model');

module.exports = {
    addProduct : asyncHandler(async (req , res) => {
        const proCode = req.body.proCode;
        const proName = req.body.proName;
        const proPackaging = req.body.proPackaging;
        const consumerPrice = req.body.consumerPrice;

        const product = await ProductModel.create({ proCode , proName , proPackaging , consumerPrice });
        res.status(201).json({ data: product });
    }),

    getProducts : asyncHandler(async (req , res) => {
        const page = req.query.page * 1 || 1
        const limit = req.query.limit * 1 || 20
        const skip = (page - 1) * limit

        const products = await ProductModel.find({})
        res.status(200).json({
            results : products.length,
            page : page,
            data : products.slice(skip,limit*page)
        })
    }),

    getProduct : asyncHandler( async (req,res,next) => {
        const { id } = req.params

        const product = await ProductModel.findById(id)
        if(!product) {
            next(new ApiError(`No Product For This Id ${id}` , 404))
        }
        else {
            res.status(200).json({ data : product })
        }
    }),

    updateProduct : asyncHandler( async (req,res,next) => {
        const { id } = req.params;
        const proName = req.body.proName;
        const proPackaging = req.body.proPackaging;
        const consumerPrice = req.body.consumerPrice;

        const product = await ProductModel.findByIdAndUpdate(
            { _id : id } , { proName , proPackaging , consumerPrice } , { new : true }
        )
        if(!product) {
            next(new ApiError(`No Product For This Id ${id}` , 404));
        }
        else {
            res.status(200).json({ data : product });
        }
    }),

    deleteProduct : asyncHandler( async (req,res,next) => {
        const { id } = req.params;

        const product = await ProductModel.findByIdAndDelete({ _id : id });
        if(!product) {
            next(new ApiError(`No Product For This Id ${id}` , 404));
        }
        else {
            res.status(204).send();
        }
    })
}