const multer = require('multer');
const { 
   
    MAX_FILE_SIZE,
    UPLOAD_USER_IMG_DIRECTORY,
    ALLOWED_FILE_TYPES
} = require("../config");


const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_USER_IMG_DIRECTORY)
    },
    filename: function (req, file, cb) {
        
        cb(null, Date.now() + "_" + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {

        return cb(new Error('File type not allowed',false));
    }
    cb(null, true)
}

const uploadUserImage = multer(
    {
        storage: userStorage,
        limits:{fileSize:MAX_FILE_SIZE},
        fileFilter:fileFilter
    })

module.exports = uploadUserImage