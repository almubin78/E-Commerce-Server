const express = require('express');
const {
    getUsers,
    getUserByID,
    deleteUserById,
    createUser,
    activateUserAccount,
    updateUserById
} = require('../controller/userController');
const upload = require('../middlewares/uploadFile');
const { validateUserRegistration } = require('../validators/auth');
const runValidation = require('../validators');
const uploadUserImage = require('../middlewares/uploadFileSecond');
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

/* 
create user
*/
userRouter.post(
    '/process-register',
    // upload.single("image"), ////for uploadFile.js
    uploadUserImage.single("image"),////for uploadFileSecond.js
    validateUserRegistration,
    runValidation,
    createUser
)
/*  
verify User
*/
userRouter.post('/activate', activateUserAccount)
/* 
get all users
*/
userRouter.get('/', isLoggedIn, getUsers)
userRouter.get('/:id', getUserByID)
userRouter.delete('/:id', deleteUserById)
/* 
updating user
*/
// userRouter.put('/:id', upload.single("image"), updateUserById)
userRouter.put('/:id', uploadUserImage.single("image"), updateUserById)



module.exports = userRouter