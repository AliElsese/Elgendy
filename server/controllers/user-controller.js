const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const UserModel = require('../models/user-model');

module.exports = {
    getAllUsers : asyncHandler(async (req , res) => {
        const users = await UserModel.find({});
        res.status(200).json({ data: users });
    }),

    createUser : asyncHandler(async (req , res) => {
        const username = req.body.username;
        const password = req.body.password;
        const isActive = (req.body.isActive == 'true' ? true : false);

        const user = await UserModel.create({ username , password , isActive });

        res.status(201).json({ data: user });
    }),

    getUser : asyncHandler(async (req , res) => {
        const { id } = req.params;
        const user = await UserModel.findOne({ _id: id });
        res.status(200).json({ data: user });
    }),

    updateUser : asyncHandler(async (req , res , next) => {
        const id = req.params.id;
        const username = req.body.username;
        const password = req.body.pasword;
        const isActive = (req.body.isActive == 'true' ? true : false);

        const user = await UserModel.findOneAndUpdate(
            { _id: id } , { username , password , isActive } , { new: true }
        );
        if(!user) {
            next(new ApiError('هذا المستخدم غير موجود' , 404));
        }
        else {
            res.status(200).json({ data: user });
        }
    }),

    deleteUser : asyncHandler(async (req , res , next) => {
        const id = req.params.id;

        const user = await UserModel.findByIdAndDelete({ _id: id });
        if(!user) {
            next(new ApiError('هذا المستخدم غير موجود' , 404));
        }
        else {
            res.status(204).send();
        }
    }),
}