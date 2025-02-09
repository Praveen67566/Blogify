import express from "express"
import multer from "multer"
import path from "path"
import {Blog} from "../Models/blog.js"

export const blogrouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads/'))
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const safeName = path.basename(file.originalname, ext).replace(/\s+/g, '-'); // Sanitize filename
        const filename = `${Date.now()}-${safeName}${ext}`;
      cb(null, filename)
    }
  })
  
  const upload = multer({ storage: storage })

blogrouter.get('/:id',async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy")

    return res.render('blog',{
        user:req.user,
        blog,
    })
})

blogrouter.get('/addblog',(req,res)=>{
    res.render('addblog',{
        user:req.user
    })
})
blogrouter.post('/',upload.single("coverImage"),async(req,res)=>{
    const {title , body} = req.body
    const blog = await Blog.create({
        title,
        body,
        coverImage:`/uploads/${req.file.filename}`,
        createdBy:req.user._id,
    })
    res.redirect("/")
})