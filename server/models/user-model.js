const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true , 'Username Required']
    },
    password: {
        type: String,
        required: [true , 'Password Required']
    }
}, { timestamps: true });

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;