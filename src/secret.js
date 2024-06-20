require('dotenv').config()

const port = process.env.PORT || 8000
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const MONGODB_ATLAS_URL = process.env.MONGODB_COMPASS_URL || "mongodb://localhost:27017"
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE_PATH || "../public/images/users/13.png"
const JWT_ACTIVATION = process.env.JWT_ACTIVATION_KEY || 'DFADFJJDJF33555dfsdfadf56565'
const smtpUserName = process.env.SMTP_USERNAME || ''
const smtpPassword = process.env.SMTP_PASSWORD || ''
const client_url = process.env.CLIENT_URL 
const uploadDir = process.env.UPLOAD_FILE || "public/images/users"
// console.log(smtpUserName,smtpPassword);

module.exports = {
    port,DB_USER, 
    DB_PASSWORD,
    MONGODB_ATLAS_URL,
    DEFAULT_IMAGE,
    JWT_ACTIVATION,
    smtpUserName,
    smtpPassword,
    client_url,
    uploadDir
}