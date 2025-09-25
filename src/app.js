const express = require("express");

const app = express();

app.listen(3001, ()=>{
  console.log("hello from the server");
});

app.use('/hello',(req,res)=>{
  res.send("hi from 3001...");
}); 