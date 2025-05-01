const express = require('express');
const app = express();
const dotenv = require('dotenv');
const authRoutes = require('./routes/userRoutes');

app.use(express.json());
dotenv.config();       

require('./config/connectdb')

app.use('/api/auth',authRoutes);

const Port = process.env.PORT || 8000;

app.listen(Port,()=>{
    console.log('Server is running on port 8000')
})