const User = require("../models/userModel")
const createError = require('http-errors');
const { successResponse } = require("./responseController");
const { default: mongoose } = require("mongoose");
const { findWithId } = require("../services/findItem");

const fs = require('fs').promises;
const { use } = require("../router/userRouter");
const deleteImage = require("../helper/deleteImg");


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
        const user = await findWithId(model,id, options)
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
        const user = await findWithId(model,id, options)


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

module.exports = {
    getUsers,  getUserByID, deleteUserById
}