const express = require('express');
const { getUsers, getUserByID, deleteUserById, createUser, activateUserAccount} = require('../controller/userController');
const upload = require('../middlewares/uploadFile');
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
userRouter.post('/process-register', upload.single("image"),createUser)
// userRouter.post('/process-register', upload,createUser)
userRouter.post('/verify', activateUserAccount)



module.exports = userRouter