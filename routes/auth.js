const express=require('express')
const mongoose=require('mongoose')
const User=mongoose.model("User")
const router=express.Router();
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET}=require('../config/key')
const requireLogin=require('../middleware/requirelogin')





router.post('/signup',(req,res)=>{
   const {name,email,password,pic}=req.body
   if(!email||!password||!name){
      return res.status(422).json({error:"please recheck"})
   }
   User.findOne({email:email})
   .then((savedUser)=>{
       if(savedUser)
       {
        return res.status(422).json({error:"user already exists"})

       }
       bcrypt.hash(password,12)
       .then(hashedpassword=>{
        const user= new User({
            email,
            name,
            password:hashedpassword,
            pic:pic
          })
          user.save()
       .then(user=>{
           return res.json({message:"saved successfully"})
       })
       .catch(err=>{
          console.log(err)
       })
       })
      
   })
   .catch(err=>{
    console.log(err);
})
})

router.post('/signin',(req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        res.status(422).json({error:"please add  provide email or password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser)
        {
            res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                //res.json({message:"successfully sign in"})
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET)
                const {_id,name,email,followers,following,pic}= savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                res.status(422).json({error:"Invalid Email or password"})

            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
})


module.exports=router