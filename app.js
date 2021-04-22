const express = require('express')
const chalk = require('chalk');
const morgan = require('morgan')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db');

dotenv.config({path:'./config/config.env'})
connectDB()
//middlewares
app.use(morgan('dev'))
app.get('/',(req,res)=>{
    res.send('home')
})

const PORT = process.env.PORT || 9000
app.listen(PORT,()=>{
    console.log(`The server is running on port ${chalk.greenBright(PORT)}`);
})