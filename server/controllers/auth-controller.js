const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const address = require('address');
const macaddress = require('macaddress')
const nodemailer = require('nodemailer');
const mailgen = require('mailgen');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const UserModel = require('../models/user-model');

const generateToken = (payload) => {
    return jwt.sign({userId: payload} , process.env.JWT_SECRET_KEY , {
        expiresIn: process.env.JWT_EXPIRE_TIME
    });
}

const generateActivationCode = (len) => {
    const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]; 
    const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"]; 
    const allNumbers = [..."0123456789"];

    const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];
    
    return [...Array(len)]
        .map(i => base[Math.random()*base.length|0])
        .join('');
}

module.exports = {
    userLogin : asyncHandler(async (req , res , next) => {
        macaddress.one(async (err, mac) => {
            const user = await UserModel.findOne({ username: req.body.username });
            if(!user || !(await bcrypt.compare(req.body.password, user.password))) {
                next(new ApiError('المستخدم او كلمة السر خطأ' , 401));
            }
            else {
                if(!user.macAddress || user.macAddress == '') {
                    var code = generateActivationCode(6);
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.NODEMAILER_EMAIL,
                            pass: process.env.NODEMAILER_PASS
                        }
                    })
                    var MailGenerator = new mailgen({
                        theme: 'default',
                        product: {
                            name: 'Mailgen',
                            link: 'https://mailgen.js/'
                        }
                    })
                    var response = {
                        body: {
                            name: 'Sky-Link',
                            intro: 'User Activation Code Has Arrived!',
                            table: {
                                data: [{
                                    username: user.username,
                                    activationCode: code
                                }]
                            }
                        }
                    }
                    var mail = MailGenerator.generate(response);
                    var mailOptions = {
                        from: process.env.NODEMAILER_EMAIL,
                        to: "latec80676@galcake.com",
                        subject : 'Generated Code',
                        html : mail
                    }
                    transporter.sendMail(mailOptions , async (err , info) => {
                        if(err) res.send(err);
                        else {
                            const token = generateToken(user._id);
                            const userData = await UserModel.findOneAndUpdate({ username: req.body.username } , { activationCode: code } , { new: true })
                            res.status(200).json({ data: userData , token });
                        }
                    })
                }
                else if(user.macAddress != mac) {
                    var userMacAddress = '';
                    var code = generateActivationCode(6);
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.NODEMAILER_EMAIL,
                            pass: process.env.NODEMAILER_PASS
                        }
                    })
                    var MailGenerator = new mailgen({
                        theme: 'default',
                        product: {
                            name: 'Mailgen',
                            link: 'https://mailgen.js/'
                        }
                    })
                    var response = {
                        body: {
                            name: 'Sky-Link',
                            intro: 'User Activation Code Has Arrived!',
                            table: {
                                data: [{
                                    username: user.username,
                                    activationCode: code
                                }]
                            }
                        }
                    }
                    var mail = MailGenerator.generate(response);
                    var mailOptions = {
                        from: process.env.NODEMAILER_EMAIL,
                        to: "latec80676@galcake.com",
                        subject : 'Generated Code',
                        html : mail
                    }
                    transporter.sendMail(mailOptions , async (err , info) => {
                        if(err) res.send(err);
                        else {
                            const token = generateToken(user._id);
                            const userData = await UserModel.findOneAndUpdate({ username: req.body.username } , { macAddress: userMacAddress , activationCode: code } , { new: true })
                            res.status(200).json({ data: userData , token });
                        }
                    })
                }
                else {
                    const token = generateToken(user._id);
                    res.status(200).json({ data: user , token });
                }
            }
        });
    }),

    checkToken : asyncHandler(async (req , res , next) => {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(new ApiError('من فضلك قم بتسجيل الدخول اولا', 401));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        const currentUser = await UserModel.findById(decoded.userId);
        if (!currentUser) {
            return next(new ApiError('The user that belong to this token no longer exist', 401));
        }

        next();
    }),

    checkActivationCode : asyncHandler(async (req , res , next) => {
        macaddress.one(async (err,mac) => {
            const user = await UserModel.findById({ _id: req.body.userId })
            if(!user || user.activationCode != req.body.activationCode) {
                next(new ApiError('كود التفعيل خطأ' , 401));
            }
            else {
                const userData = await UserModel.findByIdAndUpdate(
                    { _id: user._id } , { macAddress: mac } , { new: true }
                )
                const token = generateToken(user._id);
                res.status(200).json({ data: userData , token });
            }
        })
    })
}