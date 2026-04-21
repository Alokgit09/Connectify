const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const auth = async (req, res, next) => {
  try {
    // Token get from  Header
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ message: "No Token, access denied" });
    }
    // remove Bearer
    const cleanToken = token.replace("Bearer ", "");
    // Verify Token
    const decode = jwt.verify(cleanToken, process.env.JWT_SECRET);
    // Get User From DB Password
    const user =  await User.findById(decode.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "invalid Token" });
  }
};

module.exports = auth;
