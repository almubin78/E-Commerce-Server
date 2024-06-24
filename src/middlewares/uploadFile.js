const multer = require('multer');
const { 
    MAX_FILE_SIZE, 
    ALLOWED_FILE_TYPES 
} = require('../config');



const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    // console.log(file.mimetype, cb, 'file.mimetype,cb');
    if (!file.mimetype.startsWith("image/")) {
        return cb(new Error('Only Image file are allowed:From- UploadFile.js fileFilter'), false);

    }
    if (file.size > MAX_FILE_SIZE) {
        return cb(new Error('File size exceeds the maximum limit:UploadFile.js'), false);

    }
    if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        return cb(new Error('File extension is not allowed:UploadFile.js'), false);

    }
    cb(null, true);
}

const upload = multer(
    {
        storage: storage,
        fileFilter: fileFilter
    }
)

module.exports = upload;



// PREVIOUS USES [DISKsTORAGE]

/* 
const uploadDir = UPLOAD_USER_IMG_DIRECTORY || "public/images/users";
const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE || 1024 * 1024 * 2;
const MAX_FILE_SIZE = Number(MAX_FILE_SIZE) || 2097152;
const ALLOWED_FILE_TYPES = ALLOWED_FILE_TYPES || [
    'jpg',
    'jpeg',
    'png'
]

const userStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOAD_USER_IMG_DIRECTORY)
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(null, Date.now() + "_" + file.originalname.replace(extname, '') + extname)
    }
})

const fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname);
    if (!ALLOWED_FILE_TYPES.includes(extname.substring(1))) {

        return cb(new Error('File type not allowed',false));
    }
    cb(null, true)
}

const uploadUserImage = multer(
    {
        storage: userStorage,
        limits:{fileSize:MAX_FILE_SIZE,},
        fileFilter
    })
    module.exports = uploadUserImage

*/