const { BaseCollection } = require("mongoose");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const Path = require('path');
const fs = require('fs');

const signUp = async (req, res) => {
  //console.log("API HIT");
  try {
    const { firstname, lastname, email, password } = req.body || {};
    
    //Check User exist
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      if(req.file){
        const filePath = Path.join(__dirname, '..', 'uploads', req.file.filename);
        fs.unlink(filePath, (err) => {
         if(err){
            console.log("Image Delete Error:", err.message);
         }else{
            console.log('Uploaded Image Deleted ( User Exist Case)');
         }
        })
      
      }
    return res.status(400).json({ message: "User is already exists" });
    }

    // hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    //console.log("Hash Password>", hashedPassword);

    // Image Path
    const profileImage = req.file ? `/uploads/${req.file.filename}` : "";
    //console.log("profileImage", profileImage);

    // Create User
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      profileImage,
    });
   return res.status(201).json({
      Message: "User registered Successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

module.exports = {
  signUp,
};
