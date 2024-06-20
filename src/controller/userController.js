const User = require("../models/userModel")
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { successResponse } = require("./responseController");
const { default: mongoose } = require("mongoose");
const { findWithId } = require("../services/findItem");


const { use } = require("../router/userRouter");
const deleteImage = require("../helper/deleteImg");
const { createJsonWebToken } = require("../helper/jsonwebtoken");
const { JWT_ACTIVATION, client_url } = require("../secret");
const emailWithNodeMail = require("../helper/email");


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
            }
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

            }
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

        })
    } catch (error) {

        next(error)
    }

}
const createUser = async (req, res, next) => {
    try {
        const { name, email, password, phone, address,image } = req.body;
        // const userExits = await User.exists({ email: email })
        // console.log(userExits,email, 'user exists');
        // console.log(newUser,'==new user from controller');
        // if (userExits) {
        //     throw createError(409, 'Email Already Exists, Please Login')
        // }
        const newUser = { name, email, password, phone, address,image };
        // console.log(newUser);
        const token = createJsonWebToken(newUser, JWT_ACTIVATION, '10m');
        // console.log('token from create user==', token);
        // send mail with node Mailer

        // prepare email
        const emailData = {
            email,
            subject: 'Account Activation Email',
            html: `
                <h2>Hello ${name}</h2>
                <p>Please click here <a href='${client_url}/api/users/activate/${token}' target='_blank'>to active your account</a> </p>
            `
        }

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
            // payload: { token }
            payload: {newUser,token},
            sendFrom:'CreateUser Controller'
        })

    } catch (error) {

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
                sendFrom:'activateUserAccount (controller)'
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


module.exports = {
    getUsers,
    getUserByID,
    deleteUserById,
    createUser,
    activateUserAccount
}