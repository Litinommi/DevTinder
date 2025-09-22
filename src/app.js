const express = require("express");
const dbConnect = require("./configure/database");
const app = express();
const User = require("./models/user")
const {validateSignUpData} = require("./utils/validator")
const bcrypt = require("bcrypt");
const validator = require("validator")
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json())
app.use(cookie());


app.post("/signup",async(req,res)=>{
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

app.post("/login", async(req,res)=>{
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
        
        const isValidPassword =await bcrypt.compare(password,user.password);
        if(isValidPassword){

            const token = jwt.sign({_id: user["_id"]},"OnlyServerKnows@123",{expiresIn:"1d"});
            res.cookie("token",token)
            res.send("User logged in successfully");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.status(400).send("ERROR: "+ err.message);
    }
})

app.post("/sentConnectionRequest", userAuth ,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user.firstName+" sent the request");
    }
    catch(err){
        res.status(400).send("Please login once again"+ err.message);
    }
})
app.get("/profile",userAuth,async(req,res)=>{
    try{
        
        res.send("user")
    }
    catch(err){
        res.status(400).send("Please login once again"+ err.message);
    }
})

app.get("/getemailID",async(req,res)=>{
    try{
        const userEmail = await User.find(req.body)
        res.send(userEmail);
    }
    catch{
        res.status(404).send("Something went wrong");
    }
})

app.get("/findByID",async(req,res)=>{
    try{
        const userIddata = await User.find(req.body)
        res.send(userIddata);
    }
    catch{
        res.status(404).send("Something went wrong");
    }
})

app.get("/feed",async(req,res)=>{
    try{
        const feedData = await User.find({});
        console.log(feedData)
        if(feedData.length>0){
            res.send(feedData);
        }
        else{
            res.send("no data");
        }
    }
    catch{
        res.status(404).send("Something went wrong");
    }
})

app.delete("/deleteUser",async(req,res)=>{
    try{
        const deleteUser = await User.findByIdAndDelete(req.body);
        res.send(deleteUser);
    }
    catch{
        res.status(404).send("Something went wrong");
    }
})

app.patch("/updateUser/:userId",async(req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;
    try{

        const ALLOWED_UPDATES = ['firstName','secondName','about','skills','password'];

        const CanUpdate = Object.keys(data).every((k)=>
            ALLOWED_UPDATES.includes(k)
        )

        if(!CanUpdate){
            throw new Error("Field not found");
        }

        if(data.skills.length>10){
             throw new Error("skills cannot be entered more than 10")
        }

        const updateprofile = await  User.findByIdAndUpdate(userId,data,{
            runValidators:true
        })

        res.send("User updated successfully");
    }
    catch(err){
        res.status(404).send("Something went wrong "+err.message);
    }
})

dbConnect().then(()=>{
    console.log("database is connected")
    app.listen(7777,()=>{
        console.log("server is calling");
    })
}
).catch(err=>{
    console.log("database not connected")
})

