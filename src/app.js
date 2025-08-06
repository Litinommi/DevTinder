// Import the Express framework
const express = require("express");

// Create an instance of an Express application
const app = express();

app.use("/text",(req,re)=>{
    re.send("welcome World!!!!!!!!!!!");
})

app.listen(7777,()=>{
    console.log("server is listening");
})
