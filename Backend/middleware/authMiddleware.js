const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/usersModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //get token from header
      token = req.headers.authorization.split(" ")[1];

      //verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //get user from token
      req.user = await UserModel.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        // Token has expired, take action to log out the user
        // For example, clear user-related data from session or cookies
        return res.status(401).json({ msg: "Token expired, user logged out" });
      } else {
        res.status(401);
        throw new Error("Not Authorized");
      }
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
