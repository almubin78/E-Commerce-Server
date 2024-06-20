const multer = require('multer');
const path = require('path');
const { uploadDir } = require('../secret');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
      const extname = path.extname(file.originalname);
      cb(null,Date.now() + "_" + file.originalname.replace(extname, '')+ extname)
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload;