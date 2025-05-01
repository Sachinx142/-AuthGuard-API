//Connect DB From MongoDB
require('mongoose').connect(process.env.DB_KEY)
   .then(()=>{
    console.log("MongoDB connected successfully")
   })
   .catch((err)=>{
    console.log("MongoDB connection failed", err)   
   })

   