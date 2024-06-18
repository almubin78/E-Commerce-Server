require('dotenv').config()

const port = process.env.PORT || 8000
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const MONGODB_ATLAS_URL = process.env.MONGODB_COMPASS_URL || "mongodb://localhost:27017"
const DEFAULT_IMAGE = process.env.DEFAULT_IMAGE_PATH || "../public/images/users/13.png"

module.exports = {
    port,DB_USER, DB_PASSWORD,MONGODB_ATLAS_URL,DEFAULT_IMAGE
}