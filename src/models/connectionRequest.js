const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {timestamps: true}
);

connectionRequestSchema.index({fromUserId:1, toUserId:1});

connectionRequestSchema.pre("save", function(next){
  const connectionRequest = this; // this refers to the specific instance of the schema that is about to be saved we could have simply wrote (this.fromUserId.....) but we wrote const connectionRequest = this;  for readability
  //check if fromuserid is same as touserid
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error ("Cannot send connection request to yourself!");
  }
  next();
});

const ConnectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;

