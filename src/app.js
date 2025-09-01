const express = require("express");
const dbConnect = require("./configure/database");
const app = express();
const User = require("./models/user")

app.use(express.json())

app.post("/signup",async(req,res)=>{
    // added dynamic data from end user(i.e. postman,browser etc..)
    const userData = new User(req.body)
    try{
        await userData.save();
        res.send("stored successfully");
    }
    catch(err){
        res.send("error while saving"+ err.message);
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

