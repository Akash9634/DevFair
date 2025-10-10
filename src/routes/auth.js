const express = require("express");
const authRouter = express.Router();
const validateSignUpData = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  try{
    // validate signup data
    validateSignUpData(req);

    //encrypting the password 
    const {firstName, lastName, emailId,password} = req.body;

    const existingUser = await User.findOne({emailId});

    if(existingUser){
      return res.status(400).send("Email already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User(
      {
        firstName, lastName, emailId, password: passwordHash
      }
    );
    await user.save();
    res.status(201).send("user added successfully");
  }
  catch(err){
    res.status(400).send("error saving the user:" + err.message);
  }
});

authRouter.post("/login", async(req, res) => {
  try{
    const {emailId, password} = req.body;

    const user = await User.findOne({emailId});

    if(!user){
      return res.status(400).send("User not found");
    }

    const isMatch = await user.validatePassword(password); // schema method used 

    if(isMatch){

      const token = await user.getJWT(); // schema method used
     
      //add token to the cookie and send response back to the user 
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000)
      });

      return res.status(200).send("Login Successful");
    }
    else{
      throw new Error("Invalid Credentials");
    }
    
    
  }
  catch(err){
    res.status(500).send("Error logging in:" + err.message);
  }
})

module.exports = authRouter;