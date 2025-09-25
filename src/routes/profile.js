const express = require("express");
const { userAuth } = require("../middlewares/auth");

const profileRoute = express.Router();

profileRoute.get("/profile",userAuth,async(req,res)=>{
    try{
        
        res.send("user")
    }
    catch(err){
        res.status(400).send("Please login once again"+ err.message);
    }
})

module.exports = profileRoute;