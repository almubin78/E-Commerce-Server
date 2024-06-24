//for registration and signIn validation
const {body} = require('express-validator');

// registration validation
const validateUserRegistration = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage("Name Is require")
    .isLength({min:3,max:31})
    .withMessage('Name should be min 3 characters and max 31 long')
    ,
    body('email')
    .trim()
    .notEmpty()
    .withMessage("Email Is require")
    .isEmail()
    .withMessage('Invalid Email')
    ,
    body('password')
    .trim()
    .notEmpty()
    .withMessage("Password Is require")
    .isLength({min:6})
    .withMessage('Password Should be Minimum 6 Character')
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    )
    .withMessage("Password must be  One upper letter, One Lower letter , One number and One special character")
    ,
    body('address')
    .trim()
    .notEmpty()
    .withMessage("Address Is require")
    .isLength({min:3})
    .withMessage('Address Should be Minimum 3 Character')
    ,
    body('image')
    .optional()
    .isString()
    .withMessage("Image Is require: Auth.js")  
    
   
    

]

module.exports = {validateUserRegistration}
// go to router for use this

 /* 
    body('image')
    .custom(
        (value,{req})=>{
            // console.log(req.file,'===req.file :: auth.js');
            // console.log(value,'====value :: auth.js');
            if(!req.file || !req.file.buffer){
                throw new Error('user Image is Required:from customFunction in auth.js')
            }
            return true;
        }
    )
    .withMessage("Image  Is require:Auth.js- .withMessage()")
    
*/


/* 
//without custom rules
    body('image')
    .optional()
    .isString()
    .withMessage("Image Is require")  
*/