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

