const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/usersModel");


// generate JWT 
const generateToken = (id)=>{
  return jwt.sign({id},process.env.JWT_SECRET, {
      expiresIn:'30d'
  })
}

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
      token:generateToken(user._id)
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
  const {email, password} = req.body;

  // Check for user email
  const user = await userModel.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token:generateToken(user._id)
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
    res.status(200).json(req.user)

});



//@desc get all users names
//@route GET/api/users/getusername
//@access private 
const getUsersNames = asyncHandler(async (req, res) => {
  // Fetch all users' names except the currently logged-in user
  const users = await userModel.find({ _id: { $ne: req.user.id } }, 'name');
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



module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getUsersNames,
  updateUserProfile
};
