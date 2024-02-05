const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const userModel = require("../models/usersModel");

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

const getUsersNames = asyncHandler(async (req, res) => {
  // Fetch all users' names except the currently logged-in user
  const users = await userModel.find({ _id: { $ne: req.user.id } }, 'name');
  res.status(200).json(users);
});

 


// generate JWT 
const generateToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn:'30d'
    })
}

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getUsersNames
};
