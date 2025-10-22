const express = require("express");
const profileRouter = express.Router();
const userAuth = require("../middlewares/auth");
const bcrypt = require("bcrypt");

profileRouter.get("/profile", userAuth, async(req, res) => {
  try{
  const user = req.user;

  res.send(user);

}
catch(err){
   res.send(400).send("something went wrong");
}
});

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
  try{
   if(!validateEditProfileData(req)){
    throw new Error("Invalid edit request");
   }

   const loggedInUser = req.user;

   Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

   await loggedInUser.save();
   res.json({
    message: `${loggedInUser.firstName}, your profile is updated successfully`,
    data: loggedInUser,
   });
  }
  catch(err){
    res.status(500).send("Error updating:" + err.message);
  }
})

profileRouter.patch("/profile/password", userAuth, async(req,res) => {
  try{
    const {password} = req.body;
    
    const newHashedPassword = await bcrypt.hash(password, 10);

    const loggedUser = req.user;

    loggedUser.password = newHashedPassword;

    await loggedUser.save();

    res.json(
      {
        message: "password updated successfully",
        data: loggedUser
      }
    )

  }
  catch(err){
    res.status(500).send("Error updating password: ", err.message);
  }
})

module.exports = profileRouter;