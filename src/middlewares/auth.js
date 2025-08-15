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

const userAuth = (req,res,next)=>{
        const authToken = "xyz";
        const isAuth = authToken==="xyz";
        if(isAuth){
            console.log("User is authorized")
            next();
        }
        else{
            res.status(401).send("Not Authorized");
        }
    }

module.exports = {adminAuth,userAuth}