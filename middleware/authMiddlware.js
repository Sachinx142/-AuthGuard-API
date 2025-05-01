const jwt = require('jsonwebtoken');

// Middleware to verify JWT token and extract user info
const verifyToken = (req,res,next)=>{
    let token = req.header('Authorization')
    
    if(!token){
        res.status(401).json({message: 'Access denied. No token provided.'});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Invalid token.' });
    }
}


 // Middleware to check if user has admin role
const isAdmin = (req,res,next) => {
    if(req.user.role || req.user.role === 'admin'){
        next()
    }
    else{
        res.status(203).json({ message: 'Unauthorized. Admin access required.' });
    }
}

 // Middleware to check if user is a regular user
 const isUser = (req,res,next) => {
    if(req.user && (req.user.role === 'user' || req.user.role === 'admin')){
        next()
    }
    else{
        res.status(403).json({ message: 'Unauthorized. User access required.' });
    }
 }

module.exports = {
    verifyToken:verifyToken,
    isAdmin:isAdmin,
    isUser:isUser
}