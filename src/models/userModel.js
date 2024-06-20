const {Schema,model} = require('mongoose');
const { DEFAULT_IMAGE } = require('../secret');
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
    name:{
        type:String,
        maxLength:[31,"Max length 31"],
        minLength:[3,"Min length 3"],
        required:[true,'You Must Entire Your Name!!'],
        trim:true
    },
    email:{
        type:String,
        required:[true,'You Must Entire Your Email!!'],
        trim:true,
        unique:true,
        lowercase:true,
        validate: {
            validator: function  (v){
                return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
            },
            message:'Please Entire a valid Email'
        }

    },
    password:{
        type:String,
        required:[true,'You Must Entire Password!!'],
        minLength:[6,"Min 6 Character"] ,
        set:(v)=>bcrypt.hashSync(v,bcrypt.genSaltSync(10))
        
    },
    image:{
        type:String,
        // require:true,
        required:[true,'You Must Upload Your  Image!'],
        default: DEFAULT_IMAGE
    },
    address:{
        type:String,
        required:[true,'You Must Entire Your Address!!'],
    },
    
    phone:{
        type:String,
        required:[true,'You Must Entire Your Phone Number!!'],
    }
    ,
    isAdmin:{
        type:Boolean,
        default:false
    }
    ,
    isBanned:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true}) 

const User = model('Users',userSchema)
module.exports = User; 