const users = require("../models/userSchema");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const createUser = asyncWrapper(async (req, res) => {
  const { userName, name, password, phone, expiresAt, role } = req.body;

  const user = await users.create({
    username: userName,
    name: name || userName,
    password: await bcrypt.hash(password, 10),
    phone,
    role,
    expiresAt,
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
});

const login = asyncWrapper(async (req, res) => {
  const username = req.body.userName;
  const password = req.body.password;

  const user = await users.findOne({ username });

  if (!user) {
    return res.status(404).json({
      success: false,
      error: "User does not exist",
    });
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    return res.status(400).json({
      success: false,
      error: "Wrong password",
    });
  }

  if (user.expiresAt && user.expiresAt < new Date()) {
    return res.status(403).json({
      success: false,
      error: "Your account has expired",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user,
  });
});

const edit = asyncWrapper(async (req, res) => {
  const { myId, userId, username, phone, name, role, expiresAt, password } =
    req.body;

  const userIsAdmin = await users.findById(myId, "role");

  if (userIsAdmin.role !== "admin") {
    return res.status(500).json({
      success: false,
      message: "you are not admin",
    });
  }

  const update = {
    username,
    phone,
    name,
    role,
    expiresAt,
  };

  if (password) {
    update.password = await bcrypt.hash(password, 10);
  }

  const editedUser = await users.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "User edited successfully",
    user: editedUser,
  });
});

const deleteUser = asyncWrapper(async (req, res) => {
  const { userId } = req.params;

  const userIsAdmin = await users.findById(myId, "role");

  if (userIsAdmin.role !== "admin") {
    return res.status(500).json({
      success: false,
      message: "you are not admin",
    });
  }

  const deletedUser = await users.findByIdAndDelete(userId);

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
    user: deletedUser,
  });
});

const showAllUsers = asyncWrapper(async (req, res) => {
  const allUsers = await users.find({});

  return res.status(200).json({
    success: true,
    allUsers,
  });
});

module.exports = { createUser, login, edit, showAllUsers, deleteUser };
