const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const registerUser = async (req,res)=>{
    try {
      // Destructure the request body and get the name, email and password
      const {name,email,password} = req.body;
      
      // 1. Validate input
    if(!name || !email || !password) return res.status(400).json({message: 'Please fill all fields'});

    // 2. Check if user already exists
    const exists = await User.findOne({email});
    if(exists) return res.status(400).json({message: 'User already exists'});

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password,10);
    if(!hashedPassword) return res.status(500).json({message: 'Error hashing password'});

    // 4. Create user
    const user = await User.create({name,
        email,
        password:hashedPassword
    })
       // 5. Save user to DB
    await user.save();

      // 6. Optional: Create Secure Token (when user is created then navaigate to login page)
      const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn: '30d'
      })
      if(!token) return res.status(500).json({message: 'Error creating token'})

    // 7. Send response
    res.status(201).json({
        message: "User registered successfully",
        token
    })
    } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Internal server error'})    
    }
}

const loginUser = async(req,res)=>{
  try {
      // Destructure the request body and get the email and password and role
     const {email,password,role} = req.body;

      // 1. Validate input
     if(!email || !password || !role) return res.status(400).json({message: 'Please fill all fields'});

     //2.Check if User exists
     const user = await User.findOne({email}).select('+password');

     if(!user) return res.status(400).json({message:'User Doent exists'});

      // 3. Check if password is correct
      const isMatch = await bcrypt.compare(password,user.password);

      if(!isMatch) return res.status(400).json({message:'Invalid credentials'});
 
      // 4. Create Token (when user is created then navaigate to login page)
      const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{
        expiresIn: '30d'
      })

      if(!token) return res.status(500).json({message: 'Error creating token'})

      res.status(200).json({
        message: "User logged in successfully",
        token
      })

  } catch (error) {
      console.log(error);
      res.status(500).json({message: 'Internal server error'})     
  }
}

module.exports = {
    registerUser:registerUser,
    loginUser:loginUser,
}
