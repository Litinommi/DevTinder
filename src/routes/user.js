const { userAuth } = require("../middlewares/auth");

const express = require("express");
const userRoute = express.Router();
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")
userRoute.get("/user/requests/received",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId:user._id,
            status:"interested"
        }).populate("fromUserId",["firstName","secondName"])
        res.json({message:"Data fetched succesfully",data:connectionRequest})
    }
    catch(err){
        res.status(400).send("ERROR: "+ err);
    }
})

userRoute.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const user = req.user;
        const connections = await ConnectionRequest.find({
            $or:[
                {toUserId : user._id, status:"accepted"},
                {fromUserId : user._id, status:"accepted"}
            ]
        }).populate("fromUserId",["firstName","secondName"]).populate("toUserId",["firstName","secondName"])

        let connections_data = connections.map((each)=>{
            if(each.fromUserId._id.toString() === user._id.toString()){
                console.log("hello")
                return each.toUserId
            }
            return each.fromUserId
        }
    )
        res.json({message:connections_data});
    }
    catch(err){
        res.status(400).send("ERROR: "+err);
    }
})

userRoute.get("/user/feed",userAuth,async(req,res)=>{
    try{
        userLoggedIn = req.user;
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50?50:limit;
        let skip =(page-1)*limit;

        
        let connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId : userLoggedIn._id},
                {toUserId: userLoggedIn._id}
            ]
        }).select("fromUserId toUserId").populate("fromUserId", ["firstName","secondName"]).populate("toUserId", ["firstName","secondName"])

        let hiddenUsers = new Set();

        connectionRequests.forEach((req)=>{
            hiddenUsers.add(req.fromUserId._id.toString());
            hiddenUsers.add(req.toUserId._id.toString());
        })

        
        
        let usersInFeed = await User.find({
            $and:[
                {_id:{$nin : Array.from(hiddenUsers)}},
                {_id:{$ne : userLoggedIn._id}} 
            ]
        }).select("firstName secondName").skip(skip).limit(limit);
        
        res.status(200).json({message:  usersInFeed})
    }
    catch(err){
        res.status(400).send("ERROR: "+err);
    }
})

module.exports = userRoute