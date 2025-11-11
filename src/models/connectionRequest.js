const mongoose = require("mongoose")


const connectionRequestSchema = mongoose.Schema({
        "fromUserId":{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        "toUserId":{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        "status":{
            type:String,
            required:true,
            enum:{
               "values": ["rejected","accepted","ignored","interested"],
               message: '{VALUE} is not supported'
            },
        }
    },
    {"timestamps":true}
)


connectionRequestSchema.pre('save', function(next) {
  const connectionRequest = this;
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Request cannot be sent")
  }
  next();
});
const connectionRequestModel = mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports= connectionRequestModel
