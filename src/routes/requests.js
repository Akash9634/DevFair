const express = require("express");

const requestRouter = express.Router();

const userAuth = require("../middlewares/auth");

const ConnectionRequest = require("../models/connectionRequest");

const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      // status validation
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid Status type" + status,
        });
      }
      
      // if invalid userid is sent
      const toUser = await User.findById(toUserId);

      if(!toUser){
        res.status(404).json({
          message: "User not found"
        });
      }

      //Connection Request validation, once send to the user that user should not be able to send to us and we should also not be able to send again 
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          {fromUserId, toUserId},
          {fromUserId: toUserId, toUserId: fromUserId},
        ],
      });

      if(existingConnectionRequest){
        return res.status(400).send({
          message: "Connection request already exists"
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName + "is" + status + "in" + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR:" + err.message);
    }

    res.send(user.firstName + "sent the connection request");
  }
);

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
  try{
    const loggedInUser = req.user;
    const {status, requestId} = req.params;
    const allowedStatus = ["accepted", "rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({
        message: "Status not allowed"
      })
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested"
    });

    if(!connectionRequest){
      return res.status(404).json(
        {
          message: "Connection request not found"
        }
      )
    }

     connectionRequest.status = status;

    const data = await connectionRequest.save();

    res.json({
      message: "Connection request" + status,
      data
    })
  }
  catch(err){
    res.status(400).send("error while reviewing");
  }
})

module.exports = requestRouter;
