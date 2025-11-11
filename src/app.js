const express = require("express");
const dbConnect = require("./configure/database");
const app = express();
const User = require("./models/user")
const validator = require("validator")
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
const auth = require("./routes/auth");
const profile = require("./routes/profile")
const request = require("./routes/request");
const user = require("./routes/user")
app.use(express.json())
app.use(cookie());

app.use("/",auth);
app.use("/",profile);
app.use("/",request);
app.use("/",user)



dbConnect().then(()=>{
    console.log("database is connected")
    app.listen(7777,()=>{
        console.log("server is calling");
    })
}
).catch(err=>{
    console.log("database not connected")
})

