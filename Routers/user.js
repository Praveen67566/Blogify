import express from "express"
import { User } from "../Models/user.js"

export const router = express.Router()

router.get('/signin',(req,res)=>{
    res.render('signin')
})
router.get('/signup',(req,res)=>{
    res.render('signup')
})
router.get('/logout',(req,res)=>{
    res.clearCookie('token').redirect('/')
})
router.post('/signup',async (req,res)=>{
    const {fullname,password,email} = req.body;

    if(!fullname){
        res.status(400).send("Credentials Required")
    }
    if(!email){
        res.status(400).send("Credentials Required")
    }
    if(!password){
        res.status(400).send("Credentials Required")
    }

    const user = await User.create({
        fullname,
        email,
        password
    })
    
    console.log(user)
    res.redirect('/')
})

router.post('/signin',async (req,res)=>{
    const {email, password} = req.body;
  

    const emailexist = await User.findOne({email})
    if(emailexist){
        try {
            const token = await User.matchPassword(email,password);
            if(token){
                res.cookie('token',token).redirect('/')
            }else{
                res.render("signin")
            }
            
        } catch (error) {
            res.render('signin',{
                error:"Email or password is wrong"
            })
        }
    }else{
        res.render('signin',{
            error:"Email or password is wrong"
        })
    }
   

    

    
})
