const express = require("express");
const requestRoute = express.Router();
const { userAuth } = require("../middlewares/auth");


requestRoute.post("/sentConnectionRequest", userAuth ,async(req,res)=>{
    try{
        const user = req.user;
        res.send(user.firstName+" sent the request");
    }
    catch(err){
        res.status(400).send("Please login once again"+ err.message);
    }
})

module.exports = requestRoute;