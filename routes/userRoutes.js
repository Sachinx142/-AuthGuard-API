const express = require('express');
const router = express.Router();
const {registerUser,loginUser} = require('../controller/authController');
const { forgetPassword, verifyOTP, resetPassword } = require('../controller/forgetpasswordcontroller');
const {isAdmin, verifyToken, isUser} = require('../middleware/authMiddlware')

router.post('/register',registerUser);
router.post('/login',loginUser);


router.post('/forget-password',forgetPassword)
router.post('/verify-otp',verifyOTP)
router.post('/reset-password', resetPassword);

router.get('/admin/dashboard',verifyToken,isAdmin,(req,res)=>{
    res.send({ message: 'Welcome to the admin dashboard!' });
})

router.get('/user-profile',verifyToken,isUser,(req,res)=>{
    res.json({ message: 'Welcome to your profile!' });
})

module.exports = router