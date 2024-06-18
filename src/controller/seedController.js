const demoUsers = require("../demoUser")
const User = require("../models/userModel")

const seedController = async(req,res,next)=>{
    console.log(req.body);
    try {
        //delete all
        await User.deleteMany({})

        // inserting new users
        // console.log('Demo users===',demoUsers.users);
        const users = await User.insertMany(demoUsers.users);
        return res.status(201).send({
            message:'Users Creating SuccessFully',
            data: users
        })

    } catch (error) {
        next(error)
    }
}

module.exports = seedController