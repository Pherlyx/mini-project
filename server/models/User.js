import mongoose from 'mongoose';

const User = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verificationToken: {
        type: String
    },
    verificationTokenExpire: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetCode: {
        type: Number
    }
},{timestamps: true});

const UserModel = mongoose.models.user || mongoose.model('user', User);

export default UserModel;