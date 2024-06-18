const express = require('express');
const { getUsers, getUserByID, deleteUserById} = require('../controller/userController');
const userRouter = express.Router();



const isLoggedIn = (req, res, next) => {
    const login = true;
    if (login) {
        req.body.id = 10;
        console.log('User Logged')
        next()
    } else {
        res.status(401).send('Unauthorized')
    }
}
userRouter.get('/',isLoggedIn, getUsers)
userRouter.get('/:id', getUserByID)
userRouter.delete('/:id', deleteUserById)



module.exports = userRouter