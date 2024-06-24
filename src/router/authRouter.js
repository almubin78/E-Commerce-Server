const express = require('express');
const runValidation = require('../validators');
const { handleLogin } = require('../controller/authController');
const authRouter = express.Router();



// const isLoggedIn = (req, res, next) => {
//     const login = true;
//     if (login) {
//         req.body.id = 10;
//         console.log('User Logged')
//         next()
//     } else {
//         res.status(401).send('Unauthorized')
//     }
// }

authRouter.post('/login',handleLogin)




module.exports = authRouter