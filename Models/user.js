import mongoose from "mongoose";

import {createHmac ,randomBytes} from "crypto"
import { CreateToken } from "../Service/authentication.js";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    }
    ,salt:{
        type:String,
    }
    , password:{
        type:String,
        required:true,
    }
    ,profileimg:{
        type:String,
        default: 'images/useravtar.png'
    },role:{
        type:String,
        enum:['USER','ADMIN'],
        default:'USER'
    },
},{timestamps:true})

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified("password")) return;
     

    const salt = randomBytes(16).toString()

    const hasedpassword = createHmac('sha256',salt).update(user.password).digest("hex")

    this.salt = salt;
    this.password = hasedpassword;

    next();

})

userSchema.static("matchPassword", async function(email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("Email not valid");
    const salt = user.salt;
    
    const hasedpassword = user.password;

    const userprovidedHash = createHmac('sha256',salt)
    .update(password)
    .digest("hex")

    if(hasedpassword != userprovidedHash){
        throw new Error("Password is wrong")
    }

    const token = CreateToken(user)
    return token;
})

export const User = mongoose.model('User',userSchema)