const { default: mongoose } = require("mongoose");
const createError = require('http-errors');


const findWithId = async (Model,id,options={}) => {
    // console.log('this is findWithId =',Model,id,options);
    try {
        const item = await Model.findById(id,options);
        if (!item) throw createError(404, `Item not Found with this id`)
        // if (!item) throw createError(404, `${item}  not Found with this id`)
        return item;

    } catch (error) {
        if (error instanceof mongoose.Error) {
            throw createError(400, 'mongoose Error: Invalid user id')
        }
        throw error;
    }
}


module.exports = { findWithId}