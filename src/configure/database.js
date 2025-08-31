// Connecting to cluster using mongoose

const mongoose = require("mongoose");


const dbConnect = async()=>{
    await mongoose.connect("mongodb+srv://litin2808:OoBA4NHMNQQ06iA3@nodejs.2cagdlx.mongodb.net/devTinder");
}
module.exports = dbConnect;
