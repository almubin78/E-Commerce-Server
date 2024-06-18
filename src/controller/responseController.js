const errorResponse = (res, { statusCode = 500, message = "Internal Server Error:errorResponse" }) => {
    ////{statusCode,message} body er moddhe thakbe bole
    return res.status(statusCode).json({
        success: false,
        message: message
    })

}
const successResponse = (res,
    { 
        statusCode = 200, 
        message = "SuccessResponse", 
        payload = {} 
    }) => {
    ////{statusCode,message} body er moddhe thakbe bole
    return res.status(statusCode).json({
        success: true,
        message: message,
        payload
    })

}



module.exports = {
    errorResponse,
    successResponse
}