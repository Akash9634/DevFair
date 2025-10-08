const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
          throw new Error("Invalid emailId")
        }
      }
    },
    password: {
      type:String,
      required: true
    },
    age: {
      type:Number
    },
    gender: {
      type: String,
      validate(value){
        if(!["male", "female", "others"].includes(value)){
          throw new Error("Gender data is not valid");
        }
      }
    },
    photoUrl: {
      type: String,
      defaultPhotoUrl: "https://i.sstatic.net/l60Hf.png",
      validate(value){
        if(!validator.isURL(value)){
          throw new Error("Inavlid photoUrl")
        }
      }
    },
    about: {
      type: String,
      default:"This is default about of the user"
    },
    skills: {
      type: [String]
    }
  },
  {
  timestamps: true
  }
);


userSchema.methods.getJWT = async function() {
  const user = this;

   const token =  jwt.sign({_id: user._id}, "akash@2001", {
        expiresIn: "7d",
      });

  return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

  return isPasswordValid;
}

const User = mongoose.model("User", userSchema);

module.exports = User;