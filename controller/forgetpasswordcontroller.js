const sendMail = require('../utils/sendEmail')
const User = require('../model/User');
const bcrypt = require("bcryptjs")

const forgetPassword = async(req,   res) => {
  const {email} = req.body;
  
  try {
    // Step 1: Find User 
    const user = await User.findOne({email})
    
    //When User not on the db and it will be send this reponse 
    if(!user){
      return res.status(404).json({message:"User Not Found"})
    }

    // Step 2: Generate OTP and it will be send 6 digits otp for anyone
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Step 3: Save OTP and Expiry in User document
    user.resetOtp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes expiry

    const message = `Your Password Reset OTP is ${otp}. It will expire in 10 minutes.`

    await sendMail(user.email,'Password Reset OTP',message)

    await user.save()

    res.status(200).json({ message: "OTP sent successfully to email"})

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const verifyOTP = async(req,res) => {
    const {email,otp} = req.body;
 
    try {
        const user = await User.findOne({email})
        if(!user) return res.status(404).json({message:"User Not Found"})

      if(user.resetOtp !== otp){
        return res.status(400).json({ message: 'Invalid OTP' });
      }

      if(Date.now() > user.otpExpiry){
        return res.status(400).json({ message: 'OTP expired' });
      }

         await user.save();
         
        res.status(200).json({message:"OTP verified successfully!"})
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

const resetPassword = async(req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password')

        if (!user || user.resetOtp !== otp || Date.now() > user.otpExpiry) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successfully!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}


module.exports = {
    forgetPassword:forgetPassword,
    verifyOTP:verifyOTP,
    resetPassword:resetPassword
}