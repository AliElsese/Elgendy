const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true , 'Username Required']
    },
    password: {
        type: String,
        required: [true , 'Password Required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    macAddress: { type: String },
    activationCode: { type: String }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;