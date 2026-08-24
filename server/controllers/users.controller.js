const users = require("../models/userSchema");
const asyncWrapper = require("../middleware/asyncWrapper");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = asyncWrapper(async (req, res) => {
  userName = req.body.userNmae;
  password = req.body.password;
  phone = req.body.phone;
  role = req.body.role;
  monthsNumber = req.body.monthsNumber;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await users.create({
    userName,
    role,
    phone,
    password: hashedPassword,
    expiresAt: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 * Number(monthsNumber),
    ),
  });

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user,
  });
});

const login = asyncWrapper(async (req, res) => {
  userNmae = req.body.userNmae;
  password = req.body.password;

  const user = await users.findOne({ userNmae });

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

  return res.status(200).json({
    success: true,
    message: "Login successful",
    token,
  });
});

const edit = asyncWrapper(async (req, res) => {
  const { userId, userName, phone, password } = req.body;
  const update = {
    name,
    phone,
  };
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    update.password = hashedPassword;
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

const showAllUsers = asyncWrapper(async (req, res) => {
  const users = await users.find();

  return res.status(200).json({
    success: true,
    users,
  });
});

module.exports = { createUser, login, edit, showAllUsers };
