const express = require('express')
const router = express.Router()
const {registerUser,loginUser,currentUser,getUsersNames,updateUserProfile} = require("../controller/userController")
const {protect} = require('../middleware/authMiddleware')

router.post('/',registerUser)
router.put("/updateUserData/:userId", protect, updateUserProfile);
router.post('/login',loginUser)
router.get('/getUsersNames',protect,getUsersNames)
router.get('/current',protect,currentUser)

module.exports  =  router
