
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
const cors = require('cors')
const jwt = require('jsonwebtoken');

 const appRoot = require('app-root-path');
require('dotenv').config({
    path:appRoot + "/.env"
})


app.use(cors())
app.use(express.json())

 const mongoose = require('mongoose');
 mongoose.connect(process.env.DB_URI);
 const UserModel =  mongoose.model('User',{
    username:String,
    password:String,
   
  
 })


 app.post('/register',async (req,res)=>{
    const hashdPassword = await bcrypt.hash(req.body.password,10)
    console.log(hashdPassword)
     const overrideUser={
      ...req.body,
      password: hashdPassword
     }
   const Usett = new UserModel(overrideUser)
   Usett.save().then((resp)=>{
     res.status(201).json({msg:"user creat succesfully",resp})
  })
 })

 app.post('/Login',async(req,res)=>{
    const user =await UserModel.findOne({username:req.body.username})
    if(!user)return res.status(400).json({
        msg:"user not found"
    })
  const password = req.body.password
  const correctPassword = await bcrypt.compare(password, user.password);
  if(!correctPassword)return res.status(400).json({
    msg:"user not found"
})
const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET);
res.status(200).json({token})
  })

 app.get('/', async (req,res)=>{
  const userList = await UserModel.find({})
  res.status(200).json({
    data:userList
  })
  })

  app.put('/', async (req,res)=>{
    const{ id, ...body } = req.body
    const userList = await UserModel.findByIdAndUpdate(id , body)
    res.status(200).json({
      data:userList
    })
    })

    app.delete('/:id', async (req,res)=>{
        const userList = await UserModel.findByIdAndDelete(req.params.id)
        res.status(200).json({
          data:userList
        })
        })
const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`example app  listining on port ${PORT}`)
})