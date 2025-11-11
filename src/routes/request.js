const express = require("express");
const requestRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user");


requestRoute.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const {status,requestId} = req.params;

        const allowedStatus = ["accepted","ignored"];

        if(!allowedStatus.includes(status)){
            res.status(400).json({message:"Status not allowed!!"});
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId:loggedInUser._id,
            status:"interested",
        })

        if(!connectionRequest){
            return res.status(404).json({message:"Connection not found!!"})
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({message:"Connection Request "+ status,data})
    }
    catch(err){
        res.status(400).send("Error: "+ err.message);
    }
})

requestRoute.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUser = req.user;
        const fromUserId = fromUser._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const toUser =await User.findOne({_id:toUserId});
        const allowedStatus = ["rejected","interested"];
        if(!allowedStatus.includes(status)){
            throw new Error("Wrong connection request");
        }
        if(!toUser){
            throw new Error("The connection you sent doesn't exist");
        }
        const isRequestAlreadyExists = await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ]
        })

        if(isRequestAlreadyExists){
            throw new Error("The connection you sent already exist");
        }

        const newConnectionRequest = new ConnectionRequest({fromUserId,toUserId,status})
        await newConnectionRequest.save();
        res.send(fromUser.firstName+" sent the request");
    }
    catch(err){
        res.status(400).send("Error: "+ err.message);
    }
})





module.exports = requestRoute;