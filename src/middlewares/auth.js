const jwt = require("jsonwebtoken");
const User = require("../models/user");
const adminAuth = (req,res,next)=>{
        const authToken = "xyz";
        const isAuth = authToken==="xyz";
        if(isAuth){
            console.log("Admin is authorized")
            next();
        }
        else{
            res.status(401).send("Not Authorized");
        }
    }

const userAuth = async (req,res,next)=>{
    try{
        const cookies = req.cookies;
        if(!cookies){
            throw new Error("No cookies are present");
        }

        const {token} = cookies;
        const decodedMessage = await jwt.verify(token,"OnlyServerKnows@123");
        const {_id} = decodedMessage

        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found")
        }
        req.user = user
        next();
    }
    catch(err){
        res.status(400).send("Jwt expired "+err);
    }
    }

module.exports = {adminAuth,userAuth}