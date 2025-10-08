const jwt = require("jsonwebtoken");
const User = require("../models/user"); 
const userAuth = async (req, res, next) => {
  try{
  const cookies = req.cookies;

  const {token} = cookies;
  
  if(!token){
    throw new Error("token is not valid");
  }

  const decodeObj = await jwt.verify(token, "akash@2001");

  const {_id} = decodeObj;

  const user = await User.findById(_id);

  if(!user){
    throw new Error("User not found");
  }

  req.user = user;
  next();
}
catch(err){
  res.status(400).send("ERROR: " + err.message );
}
};

module.exports = userAuth;