const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email id is not valid")
            }
        }
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
    {"timestamps":true}
)

userSchema.methods.getJWT = async function(){
    // because we cant use this in arrown function we didnt entered
    const user = this;
    const token = jwt.sign({_id: user["_id"]},"OnlyServerKnows@123",{expiresIn:"1d"});
    return token
}

userSchema.methods.isValidPassword = async function(UserSentPassword){
    const user = this;
    const isValidPassword =await bcrypt.compare(UserSentPassword,user.password);
    return isValidPassword
}

const userModel = mongoose.model("User",userSchema);

module.exports = userModel