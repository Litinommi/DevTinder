const express = require("express");
const {validateSignUpData} = require("../utils/validator")
const bcrypt = require("bcrypt");
const User = require("../models/user")
const jwt = require("jsonwebtoken");
const validator = require("validator")


const authRouter = express.Router()

authRouter.post("/signup",async(req,res)=>{
    // added dynamic data from end user(i.e. postman,browser etc..)
    try{

        validateSignUpData(req)

        const {firstName,secondName,emailId,password} = req.body;
        // encrypting the password
        const hashPassword = await bcrypt.hash(password,10) // rounds =10 more rounds more security but takes return promise which takes more time


        const userData = new User({firstName,secondName,emailId,password:hashPassword});
        await userData.save();
        res.send("stored successfully");
    }
    catch(err){
        res.send("ERROR: "+ err.message);
    }
})

authRouter.post("/login", async(req,res)=>{
    try{
        const{emailId,password} = req.body;
        const user =await User.findOne({emailId:emailId});
        if(!validator.isEmail(emailId)){
            throw new Error("Please enter valid email");
        }
        else if(!validator.isStrongPassword(password)){
            throw new Error("Please enter strong password");
        }
        if(!user){
            throw new Error("Invalid Credentials")
        }
        
        const isValidPassword =await user.isValidPassword(password);
        if(isValidPassword){
            token = await user.getJWT();
            res.cookie("token",token)
            res.send("User logged in successfully:"+ user);
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

authRouter.post("/logout",async(req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now())
    });
    res.send("User logged out Successfully");
})

module.exports = authRouter;