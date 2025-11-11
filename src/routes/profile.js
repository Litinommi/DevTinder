const express = require("express");
const { userAuth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");

const profileRoute = express.Router();

profileRoute.get("/profile/view",userAuth,async(req,res)=>{
    try{
        const user = req.user
        console.log(user)
        res.send(user)
    }
    catch(err){
        res.status(400).send("Please login once again"+ err.message);
    }
})

profileRoute.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        const allowedFields = [
            "firstName",
            "secondName",
            "gender",
            "about",
            "skills"
        ]

        const newUpdatedProdfile = req.body
        const isAllowedToEdit = Object.keys(newUpdatedProdfile).every(key=>(
            allowedFields.includes(key)
        ))
        const user = req.user;
        console.log(user)
        if (isAllowedToEdit){
            Object.keys(newUpdatedProdfile).forEach(key=>{
                user[key] = newUpdatedProdfile[key]
        })
            user.save()
            res.send("User profile updated successfully");
        }
        else{
            throw new Error("cannot update the fields");
        }

    }
    catch(err){
        res.status(400).send("There is wrong field in editing", +err);
    }
})

profileRoute.patch("/profile/edit",userAuth,async(req,res)=>{
    try{
        const allowedFields = [
            "firstName",
            "secondName",
            "gender",
            "about",
            "skills"
        ]

        const newUpdatedProdfile = req.body
        const isAllowedToEdit = Object.keys(newUpdatedProdfile).every(key=>(
            allowedFields.includes(key)
        ))
        const user = req.user;
        if (isAllowedToEdit){
            Object.keys(newUpdatedProdfile).forEach(key=>{
                user[key] = newUpdatedProdfile[key]
        })
            await user.save()
            res.send("User profile updated successfully");
        }
        else{
            throw new Error("cannot update the fields");
        }

    }
    catch(err){
        res.status(400).send("There is wrong field in editing", +err);
    }
})

profileRoute.patch("/profile/password",userAuth,async (req,res)=>{
    try{
        const {password,newPassword} = req.body;
        const user = req.user;
        

        const isValidPassword = await user.isValidPassword(password)
        if(isValidPassword){
            const hashPassword = await bcrypt.hash(newPassword,10)
            user['password'] = hashPassword;
            await user.save()
            res.send("Password updated successfully");
        }
        else{
            throw new Error("Invalid password");
        }
    }
    catch(err){
        res.status(400).send("Cannot change pasword:" +err);
    }
})

module.exports = profileRoute;