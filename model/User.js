const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email: { type: String, required: true, unique: true },
    password:{type:String,required:true},
    role:{type:String,default:"user"},
    createdAt:{type:Date,default:Date.now},//Generate Unique Date
    updatatedAt:{type:Date,default:Date.now},//Generate Unique Update Date
    resetOtp: { type: String }, //Reset Otp For User when user are forgetting email for password    
    otpExpiry: { type: Date } 
})

const User = mongoose.model('User',UserSchema);

module.exports = User;