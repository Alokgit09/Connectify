const { BaseCollection } = require("mongoose");
const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateJWToken = require("../Middleware/jwtwebToken");
const Path = require("path");
const fs = require("fs");

const signUp = async (req, res) => {
  //console.log("API HIT");
  try {
    const { firstname, lastname, email, password } = req.body || {};

    //Check User exist
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      if (req.file) {
        const filePath = Path.join(
          __dirname,
          "..",
          "uploads",
          req.file.filename,
        );
        fs.unlink(filePath, (err) => {
          if (err) {
            console.log("Image Delete Error:", err.message);
          } else {
            console.log("Uploaded Image Deleted ( User Exist Case)");
          }
        });
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

// User Login Code
const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    // check User Exist
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(400).json({ message: "Invalid E-mail Address" });
    }

    // Check Hash Password
    const checkPassword = await bcrypt.compare(password, userExist.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Invalid User Password" });
    }
    // Generate Token
    const token = await generateJWToken(userExist._id, email);
    console.log("token>>>>", token);
    return res.status(200).json({
      message: "Login Successfuly",
      token: token,
      user: userExist,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUserDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstname, lastname, email, password } = req.body;
    const user = await User.findOne(userId);

    if (!user) {
      if (req.file) {
        const filePath = Path.join(
          __dirname,
          "..",
          "uploads",
          req.file.filename,
        );
        fs.unlink(filePath, () => {});
      }
      return res.status(404).json({ message: "user not found" });
    }

    // Check Duplicate Email
    if (email && email !== user.email) {
      const existEmail = await User.findOne({ email });
      if (existEmail) {
        return res.status(400).json({ message: "User is already exist" });
      }
    }
    // Hash Password
    let hashPassword = user.password;
    if (password) {
      hashPassword = await bcrypt.hash(password, 10);
    }

    // profile Image Update
    let profileImage = user.profileImage;
    if (req.file) {
      // Delete Old Image
      if (user.profileImage) {
        const oldPath = Path.join(__dirname, "..", user.profileImage);
        fs.unlink(oldPath, (err) => {
          if (err) console.log("Old Image Delete Error:", err.message);
        });
      }
      profileImage = `/uploads/${req.file.filename}`;
    }

    // Update User
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstname: firstname || user.firstname,
        lastname: lastname || user.lastname,
        email: email || user.email,
        password: hashPassword,
        profileImage,
      },
      { returnDocument: "after" },
    ).select("-password");

    res.status(200).json({
      message: "User Data Successfully Updated",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    // check Fields
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "All Fields are required" });
    }

    // Check User
    const user = await User.findOne(userId);
    if(!user) {
      return res.status(404).json({ message: "User is not found"});
    }

    //Compare Old Password
    const isMatch = await bcrypt.compare( oldPassword, user.password);
    if(!isMatch){
      return res.status(400).json({ message: "old Password is incorrect"})
    }

    // Hash New Password
    const hashNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashNewPassword;
    await user.save();
    res.status(200).json({
      message: "Password Changed Successfully",
      user: user,
    })
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  signUp,
  logIn,
  updateUserDetails,
  changePassword,
};
