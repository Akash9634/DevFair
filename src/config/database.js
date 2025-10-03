const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Akash0114:akash2020@cluster0.exynxes.mongodb.net/devTinder"
  )
};
 
module.exports = connectDB;
