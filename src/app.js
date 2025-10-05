const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const validateSignUpData = require("./utils/validation")
const bcrypt = require("bcrypt");

app.use(express.json());

app.post("/signup", async (req, res) => {
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

//login API
app.post("/login", async(req, res) => {
  try{
    const {emailId, password} = req.body;

    const user = await User.findOne({emailId});

    if(!user){
      return res.status(400).send("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){
      return res.status(400).send("Invalid Credentials");
    }
    
    res.status(200).send("Login Successful");
  }
  catch(err){
    res.send(500).send("Error logging in:" + err.message);
  }
})

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try{
    const users = await User.find({emailId: userEmail});
    if(users.length === 0){
      res.send(404).send("user not found");
    }
    else{
      res.send(users);
    }

  }
  catch(err){
    res.send(400).send("something went wrong");
  }
});

app.get("/feed", async(req, res) => {

  try{
    const users = await User.find({}); // if we do find by writing empty filters it returns all the users 
    res.send(users);
  }
  catch(err){
    res.status(400).send("something went wrong");
  }
});

app.delete("/user", async (req,res) => {
  const userId = req.body.userId;
  try{
    const user = await User.findByIdAndDelete(userId);
    res.send("user deleted successfully");
  }
  catch(err){
    res.status(400).send("something went wrong");
  }
});

//update data of the user

app.patch("/user/:userId", async(req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try{

    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every( (k) => 
      ALLOWED_UPDATES.includes(k)
  );

  if(!isUpdateAllowed){
    throw new Error("Updates not allowed");
  }

  if(data?.skills.length > 10){
    throw new Error("skills can not be more than 10");
  }
    await User.findByIdAndUpdate({_id : userId}, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("user updated successfully");
  }
  catch(err){
    res.status(401).send("something went wrong");
  }

})


connectDB()
  .then(()=>{
    console.log("Database conncetion established");
    app.listen(3001, ()=>{ //we are listening to the server after db conncetion is successful, what if db connection is not successful and users are hitting the apis 
    console.log("hello from the server");
});
  })
  .catch((err)=>{
    console.error("database can not be connected");
  });






app.use('/hello',
  (req,res,next)=>{
    console.log("hello");
  res.send("hi from 3001...");
  next();
},
 (req,res)=>{
  console.log("hi from second func");
  res.send("hi response 2nd");
 }
); 