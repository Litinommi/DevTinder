const express = require("express");
const dbConnect = require("./configure/database");
const app = express();
const User = require("./models/user")

app.post("/signup",async(req,res)=>{
    const userData = new User({
        "firstName": "Litin",
        "secondName": "Ommi",
        "emailId":"litin.ommi123@gmail.com",
        "password":"naa estam",
    })
    try{
        await userData.save();
        res.send("stroed successfully");
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

