const validator = require("validator");

const validateSignUpData = (req,res)=>{
    const {firstName,secondName,emailId,password} = req.body;

    if(!firstName || !secondName){
        throw new Error("Please enter name correctly");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Please enter valid email");
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password");
    }
}

module.exports = {validateSignUpData};