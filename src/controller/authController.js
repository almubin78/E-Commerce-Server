const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { JWT_ACTIVATION, client_url, JWT_ACCESS_KEY } = require("../secret");
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

/* Code Start */
const handleLogin = async(req,res,next) =>{
    try {
        const {email,password} = req.body;
        /* user exist or not */
        const user = await User.findOne({email});
        if(!user){
            throw createError(404,'User Dose not exist with this email.Please register first');

        }
        /* compare password */
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            throw createError(401,"password does not match")
        }
        
        /* IsBanned */
        
        if(user.isBanned){
            throw createError(403,"You are Banned.Please Contact with Authority")
        }
        /* Token and cookie */

        // const { name, phone, address } = user;
        // const payload = { name, email, password, phone, address }
        const accessToken = createJsonWebToken({email}, JWT_ACCESS_KEY, '10m');
        res.cookie('accessToken',accessToken,{
            maxAge: 15 * 60 * 1000,//15 minit
            httpOnly:true,
            // secure:true,
            sameSite:'none'
        })

        /* If success all of process above */
        return successResponse(res, {
            statusCode: 201,
            message: `Welcome! You are Logged In`,
            payload: {user},
            sendFrom: 'Handle Login in AuthController.js'
        })

        

        
        
    } catch (error) {
        next(error)
    }
}








module.exports = {
    handleLogin,

}
/* 
step: 
1.get email,password from req.body
2.isExist
3.compare the password
4.isBanned
5.token,cookie


*/
