const express = require('express')
const router = express.Router()
const {registerUser,loginUser,currentUser,getUsersNames} = require("../controller/userController")
const {protect} = require('../middleware/authMiddleware')

router.post('/',registerUser)
router.post('/login',loginUser)
router.get('/getUsersNames',protect,getUsersNames)
router.get('/current',protect,currentUser)

module.exports  =  router
