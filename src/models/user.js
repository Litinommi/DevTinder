const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    "firstName":{
        type : String
    },
    "secondName":{
        type : String,
    },
    "emailId":{
        type:String,
    },
    "password":{
        type:String,
    },
})

const userModel = mongoose.model("User",userSchema);

module.exports = userModel