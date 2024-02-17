const express = require('express')
const router = express.Router()
const {registerUser,loginUser,currentUser,getUsersNames,updateUserProfile,postResetLink,resetPassword,postForgotPassword} = require("../controller/userController")
const {protect} = require('../middleware/authMiddleware')

router.post('/',registerUser)
router.put("/updateUserData/:userId", protect, updateUserProfile);
router.post('/login',loginUser)
router.get('/getUsersNames',protect,getUsersNames)
router.get('/current',protect,currentUser)
router.post('/reset-link',postResetLink)
// Route for rendering the password reset form
router.get('/rechange-password/:token', resetPassword);

// Route for handling the password reset form submission
router.post('/rechange-password/:token', postForgotPassword);
module.exports  =  router
