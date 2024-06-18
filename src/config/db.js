const mongoose = require('mongoose');
const { MONGODB_ATLAS_URL } = require('../secret');

const connectDB = async(parameter = {})=>{
    try {
        await mongoose.connect(MONGODB_ATLAS_URL)
        console.log('Database connected');





        mongoose.connection.on('error',(error)=>{
            console.error("Db Conncetion error : ",error)
        })
    } catch (error) {
        console.error('Could not connected to db',error.toString())
    }
}
module.exports = connectDB