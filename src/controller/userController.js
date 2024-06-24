const User = require("../models/userModel")
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");



const deleteImage = require("../helper/deleteImg");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { JWT_ACTIVATION, client_url } = require("../secret");
const emailWithNodeMail = require("../helper/email");
const runValidation = require("../validators");


const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;
        const searchRegEx = new RegExp(".*" + search + ".*", 'i')
        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegEx } },
                { email: { $regex: searchRegEx } },
                { phone: { $regex: searchRegEx } },
            ]
        }
        const options = {
            password: 0, isBanned: 0, image: 0, updatedAt: 0, createdAt: 0, isAdmin: 0
        }

        const users = await User.find(filter, options).limit(limit).skip((page - 1) * limit)

        const count = await User.find(filter).countDocuments()
        if (!users) throw createError(404, "No user Found")


        return successResponse(res, {
            statusCode: 200,
            message: 'Getting All Users from successResponse',
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(count / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,

                }
            },
            sendFrom: 'getUser Controller'
        })
    } catch (error) {
        next(error)
    }

}

const getUserByID = async (req, res, next) => {
    try {

        const id = req.params.id;
        // console.log(id,'id from getUserByID');
        const options = { password: 0 }
        const model = User
        // console.log(model,'===Model');
        const user = await findWithId(model, id, options)
        console.log(user);

        return successResponse(res, {
            statusCode: 200,
            message: 'Getting Single User from successResponse',
            payload: {
                user

            },
            sendFrom: 'getUserById : controller'
        })
    } catch (error) {

        next(error)
    }

}
const deleteUserById = async (req, res, next) => {
    try {

        const id = req.params.id;
        const options = { password: 0 }
        const model = User;
        const user = await findWithId(model, id, options)


        const userImagePath = user.image;

        deleteImage(userImagePath)


        await User.findByIdAndDelete({
            _id: id,
            isAdmin: false
        })


        return successResponse(res, {
            statusCode: 208,
            message: 'User Deleted Successfully',
            sendFrom: 'deleteUserById : controller'

        })
    } catch (error) {

        next(error)
    }

}
/* 

processRegister (createUser)
*/
const createUser = async (req, res, next) => {
    try {


        // image related
        const image = req.file;
        if (!image) {

            throw createError(400, 'ImageFile is required:from Create User:controller')
        }
        if (image.size > 1024 * 1024 * 2) {
            //1024 * 1024 *2 = 2 mb
            throw new Error('File Size is too large, max 2mb')
        }


        /* 
        user check
        */
        const { name, email, password, phone, address } = req.body;

        const userExits = await User.exists({ email: email });

        if (userExits) {
            throw createError(409,
                'Email Already Exists, Please Login')
        }

        const newUser = { name, email, password, phone, address, image }

        // const imageBufferString = image.buffer.toString('base64'); //so image become as buffer String
        // const newUser = { name, email, password, phone, address, image: imageBufferString }

        /* 
        create Token
        */

        const payload = { name, email, password, phone, address }
        const token = createJsonWebToken(payload, JWT_ACTIVATION, '10m');


        /* 
           prepare email
        */

        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
                <h2>Hello ${name}</h2>
                <p>Science and Technology এর পক্ষ থেকে তোমায় স্বাগত!! </p>
                <p style="color:red">পরবর্তি ধাপে যেতে  <a href='${client_url}/api/users/activate/${token}' target='_blank'>এখানে ক্লিক কর</a> </p>
                <img src="https://i.ibb.co/hyqMD1J/lamiya-2.jpg" alt="Girl in a jacket" width="400" height="300">
                
            `
        }
        /* 
         send mail with node Mailer
        */
        try {
            // await emailWithNodeMail(emailData);
        } catch (emailError) {
            next(createError(500, 'Field to send Verification Email'));
            return
        }
        // console.log(token,'token from controller');
        return successResponse(res, {
            statusCode: 201,
            message: `Please Go to Your ${email} for completing your registrations process`,
            payload: { newUser, token },
            sendFrom: 'CreateUser Controller'
        })

    } catch (error) {
        console.log(error, '=====error');

        next(error)
    }

}
const activateUserAccount = async (req, res, next) => {
    try {
        const token = req.body;
        if (!token) throw createError(404, 'Token not found')
        // console.log(token.token,'token from req.body');
        try {
            const decoded = jwt.verify(token.token, JWT_ACTIVATION)
            if (!decoded) throw createError(404, 'User was not verified')
            // console.log(decoded);
            const userExits = await User.exists({ email: decoded.email })
            if (userExits) {
                throw createError(409, 'Email Already Exists, Please Login')
            }
            const newUser = await User.create(decoded)
            // await User.create(decoded)
            return successResponse(res, {
                statusCode: 201,
                message: `Your account has been activated successfully!! Congratulations`,
                payload: newUser,
                sendFrom: 'activateUserAccount (controller)'
            })

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw createError(401, 'Token has expired')
            } else if (error.name == 'JsonWebTokenError') {
                throw createError(401, 'Invalid Token')
            } else {
                throw error
            }
        }
    } catch (error) {

        next(error)
    }

}
const updateUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        await findWithId(User, userId) //if error come 
        const updateOptions = { new: true, runValidation: true, context: 'query' }

        let updates = {};

        for (let key in req.body) {
            if (['name', 'email', 'password', 'phone', 'address'].includes(key)) {
                updates[key] = req.body[key]
            } else if (['email'].includes(key)) {
                throw createError(404, 'Email can not be updated')
            }
        }
        const image = req.file;
        if (image) {
            if (image.size > 1024 * 1024 * 2) {
                //1024 * 1024 *2 = 2 mb
                throw new Error('File Size is too large, max 2mb')
            }
            updates.image = image.buffer.toString('base64')
        }
        //don't delete
        // if some one update email wrongly so you can prevent it to update if 
        // delete updates.email;

        // updated user
        const updatedUser = await User.findByIdAndUpdate(userId, updates, updateOptions).select('-password');

        if (!updatedUser) {
            throw createError(404, 'User with this id does not exist')
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'updating User from updateUserById: controller',
            payload: updatedUser,
            sendFrom: 'updateUserById : controller'
        })
    } catch (error) {

    }
}


module.exports = {
    getUsers,
    getUserByID,
    deleteUserById,
    createUser,
    activateUserAccount,
    updateUserById
}

/* 
//if you dont use for loop then make it simple
       let updates = {};
        //    name,email,password,phone,address,image

        if (req.body.name) {
            updates.name = req.body.name
        }
        if (req.body.email) {
            updates.email = req.body.email
        }
        if (req.body.password) {
            updates.password = req.body.password
        }
        if (req.body.phone) {
            updates.phone = req.body.phone
        }
        if (req.body.address) {
            updates.address = req.body.address
        }


*/