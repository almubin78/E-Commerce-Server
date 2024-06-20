const errorResponse = (res,
    {
        statusCode = 500,
        message = "Internal Server Error:errorResponse",
        sendFrom=''
    }) => {
    ////{statusCode,message} body er moddhe thakbe bole
    return res.status(statusCode).json({
        success: false,
        message: message,
        fromWhere: "from errorResponse (responseController.js)",
        sendFrom
    })

}
const successResponse = (res,
    {
        statusCode = 200,
        message = "SuccessResponse",
        payload = {},
        sendFrom = ''
    }) => {
    ////{statusCode,message} body er moddhe thakbe bole
    return res.status(statusCode).json({
        success: true,
        message: message,
        payload,
        fromWhere: "from successResponse (responseController.js)",
        sendFrom
    })

}



module.exports = {
    errorResponse,
    successResponse
}