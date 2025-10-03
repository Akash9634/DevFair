const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type:String,
      required: true
    },
    lastName: {
      type:String,
      required: true
    },
    emailId: {
      type:String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type:String,
      required: true
    },
    age: {
      type:Number
    },
    gender: {
      type: String
    },
    photoUrl: {
      type: String,
      defaultPhotoUrl: "https://i.sstatic.net/l60Hf.png"
    },
    about: {
      type: String,
      default:"This is default about of the user"
    },
    skills: {
      type: [String]
    }
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;