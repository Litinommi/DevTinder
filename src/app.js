const express = require("express");

const app = express();

const {adminAuth, userAuth} = require("./middlewares/auth")

app.use("/admin",
    adminAuth
)


app.use("/user/getAllUserData", userAuth,(req,res)=>{
   res.send("user data responeded");
})

app.use("/admin/getAllData",(req,res)=>{
    res.send("All data is triggered");
})

app.use("/admin/deleteAdmin",(req,res)=>{
    res.send("admin deleted");
})
app.listen(7777,()=>{
    console.log("server is calling");
})
