const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const xssClean = require('xss-clean');

const rateLimit = require('express-rate-limit');
const userRouter = require('./router/userRouter');
const seedRouter = require('./router/seedRouter');
const { errorResponse } = require('./controller/responseController');
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    message:"কি হইছে রে? এত ঘুতাও ক্যান?"
})

// middleWare
app.use(limiter) ////for all route, indevidually kore zay 
app.use(xssClean()) //// top a rakhte hobe 
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// require('dotenv').config()

app.use('/api/users',userRouter)
app.use('/api/seed',seedRouter)






// client errors handling
app.use((req, res, next) => {
    // res.status(404).send({message:"wrong  route"});
    next(createError(404, 'wrong  route from client'))
})
// server errors handling
app.use((err, req, res, next) => {
    // return res.status(err.status || 500).json({
    //     success: false,
    //     message: "Server Error Found"
    // })
    return errorResponse(res,{
        statusCode:err.status,
        message:err.message
    })
})

module.exports = app