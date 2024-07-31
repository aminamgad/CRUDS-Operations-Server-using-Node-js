const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name) return res.status(400).json({ error: "The name is required" });
  if (!email) return res.status(400).json({ error: "The email is required" });
  if (!password)
    return res.status(400).json({ error: "The password is required" });
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(401).json({ msg: "Email is in used" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(200).json({ status: "success", user: newUser });
  } catch (error) {
    res.status(400).json({ msg: `Error : ${error.message}` });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!password)
    return res.status(400).json({ error: "The password is required" });
  if (!email) return res.status(400).json({ error: "The email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({ Err: "Invalid Email or password" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ Err: "Invalid Email or password" });
    //generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    res.status(200).json({ status: "success", user, token });
  } catch (error) {
    res.status(400).json({ msg: `Error : ${error.message}` });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { email, name } = req.body;
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(200).json({ Err: "User not found" });
    if (name) user.name = name;
    if (email) user.email = email; //the email not using

    await user.save();

    res.status(200).json({ status: "success", user });
  } catch (error) {
    res.status(400).json({ msg: `Error : ${error.message}` });
  }
};

//Admins

//this route make it from your device only
exports.signUpAdmins = async (req, res) => {
  const { name, email, password, isAdmin } = req.body;
  if (!name) return res.status(400).json({ error: "The name is required" });
  if (!email) return res.status(400).json({ error: "The email is required" });
  if (!password)
    return res.status(400).json({ error: "The password is required" });
  try {
    // Ensure the user making the request is an admin
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }
    const newAdmin = new User({ name, email, password, isAdmin: true });
    await newAdmin.save();
    //generate token
    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, {
      expiresIn: "90d",
    });
    res.status(200).json({ status: "success", user: newAdmin, token });
  } catch (error) {
    res.status(400).json({ msg: `Error : ${error.message}` });
  }
};

exports.GetAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: "success", users });
  } catch (error) {
    res.status(400).json({ msg: `Error : ${error.message}` });
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ status: "success", message: "User deleted" });
  } catch (error) {
    res.status(400).json({ msg: `Error: ${error.message}` });
  }
};
