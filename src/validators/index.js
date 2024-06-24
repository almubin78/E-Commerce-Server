// we will use this more and more time
const {validationResult} = require('express-validator');
const { errorResponse } = require('../controller/responseController');
const runValidation =(req,res,next) =>{
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return errorResponse(res,{
                statusCode:422,
                message:errors.array()[0].msg,
                sendFrom:'runValidation'
            })
        }
        return next()
    } catch (error) {
        return next(error)
    }
}


module.exports = runValidation;