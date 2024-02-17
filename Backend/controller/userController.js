const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/usersModel");
const logger = require("../middleware/winston"); // Import your logger
const sendResetLinkEmail = require("../middleware/sendResetLinkEmail"); // Import your email sending utility
const { JWT_RESET_KEY } = process.env;
// generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

//@desc   Register new user
//@route  POST /api/users
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  // check user exist
  const userExist = await userModel.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("User Already Exist");
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create user
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

///////////////////////////////////////////////////////////////////

//@desc   Authenticate a user
//@route  GET /api/users/login/
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await userModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Crediantial");
  }
});

//@desc   Get user data
//@route  GET /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

//@desc get all users names
//@route GET/api/users/getusername
//@access private
const getUsersNames = asyncHandler(async (req, res) => {
  // Fetch all users' names except the currently logged-in user
  const users = await userModel.find({ _id: { $ne: req.user.id } }, "name");
  res.status(200).json(users);
});

//@desc Update user profile when he logged in himself and then he can
// change his data without using otp. ---- Add OTP validation to this code
//@route PUT/api/users/updateuser
//@access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    // Check if a new password is provided and update it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

//@desc post reset password Link
//@route POST/api/users/sendResetLink
//@access public
const postResetLink = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    console.log("User found:", user);
    if (!user) {
      res.status(404).json({
        error: `User with email ${email} is not registered. Please try again or register first.`,
      });
      return;
    }

    // User found with email, send reset link email
    sendResetLinkEmail(req, res, next, user.email);

    return res.status(200).json({
      success: true,
      success_msg: `An email with a link to reset the password has been sent to ${user.email}. Please reset your password.`,
    });
  } catch (error) {
    console.error("Error in findOne query:", error);
    logger.error(error);
    res.status(500).json({ error_msg: "Internal Server Error" });
    return;
  }
});

// Function to render the password reset form
const resetPassword = (req, res) => {
  // Instead of rendering an EJS template, send JSON response
  res.json({ token: req.params.token });
};

//@desc post change password
//@route POST/api/users/rechange-password/:token
//@access public
const postForgotPassword = async (req, res, next) => {
  try {
    
    const { token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, JWT_RESET_KEY);
 
    const user = await userModel.findOne({
      _id: decoded.id,
      email: decoded.email,
      reset_key: token,
    });

    if (!user) {
     
      return res
        .status(400)
        .json({ error_msg: "Invalid User or expired link." });
    }

    // Process the password update
    user.reset_key = "";
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    user.password = hash;
    await user.save();
    
    // Redirect or send a success message to your React component
    return res
      .status(200)
      .json({ success_msg: "Password updated successfully." });
  } catch (error) {
    // Handle JWT errors
    logger.error(error);
    console.error("Error in postForgotPassword:", error);

    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ error_msg: "Link is expired, please regenerate..." });
    }

    if (error.name === "JsonWebTokenError") {
      return res
        .status(400)
        .json({ error_msg: "Link is invalid, please regenerate..." });
    }

    return res.status(500).json({ error_msg: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getUsersNames,
  updateUserProfile,
  postResetLink,
  resetPassword,
  postForgotPassword,
};
