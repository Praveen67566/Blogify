import express from "express"
import mongoose from "mongoose"
import path from "path"
import cookieParser from "cookie-parser";
import { router } from "./Routers/user.js";
import { blogrouter } from "./Routers/blog.js";
import { checkForauthenticationcookie } from "./middleware/authentication.js";
import { Blog } from "./Models/blog.js";

const app = express()

app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(express.static('./public'))

app.set('view engine','ejs');
app.set('Views',path.resolve('./views'))

app.use(checkForauthenticationcookie("token"))
app.use('/user',router)
app.use('/blog',blogrouter)

mongoose.connect('mongodb://localhost:27017/blogify').then(()=>{
    app.listen(3000,()=>{
        console.log("Server is listening....")
        console.log("Database Connected...")
    })
}).catch((err)=>{
    console.log("Error occured")
})

app.get('/',async (req,res)=>{
    const allblogs = await Blog.find({});
    res.render('home',{
        user:req.user,
        blogs:allblogs,
    })
})
