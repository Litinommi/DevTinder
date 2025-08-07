const express = require("express");

const app = express();

app.get("/test",(req,res)=>{
    res.send("request is GET");
})

app.post("/test",(req,res)=>{
    res.send("request is POST");
})

app.patch("/test",(req,res)=>{
    res.send("request is patch");
})

app.delete("/test",(req,res)=>{
    res.send("request is delete")
})

app.listen(7777,()=>{
    console.log("server is calling");
})
