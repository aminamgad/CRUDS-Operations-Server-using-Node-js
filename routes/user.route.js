const express = require('express');
const router = express.Router();
const {signUp ,login,GetAllUsers, updateUserProfile, deleteUser, signUpAdmins} = require('../services/user.services');
const {protect, admin} = require("../middlewares/auth")

// Define the sign-up and login routes
router.post('/sign-up', signUp);
router.post('/login', login);

// Get user by his token only
router.get('/profile', protect, (req, res) => {
    res.status(200).json({ status: 'success', user: req.user });
});
router.put("/updateMyProfile",protect,updateUserProfile)


//Get All users for Admins
router.post("/createAdmin",protect,admin,signUpAdmins)
router.get("/AllUsers" , protect,admin,GetAllUsers)
router.delete("/deleteUser/:id" , protect,admin,deleteUser)

module.exports = router;
