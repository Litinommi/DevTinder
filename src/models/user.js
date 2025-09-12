const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    "firstName":{
        type : String,
        minLength : 4,
        maxLength : 50
    },
    "secondName":{
        type : String,
        minLength : 4,
        maxLength : 50
    },
    "emailId":{
        type:String,
        unique : true,
        trim: true
    },
    "gender":{
        type: String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("Gender is not valid");
                }
            }
        },
    
    "password":{
        type : String,
        minLength: 8
    },
    "about":{
        type:String,
        default:"Hi"
    },
    "skills":{
        type:[String]
    }
    
},
    {"timestamps":true})

const userModel = mongoose.model("User",userSchema);

module.exports = userModel