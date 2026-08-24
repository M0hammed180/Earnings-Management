const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, 
  },
  name: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  phone: String,
  password: {
    type: String,
    required: true, 
  },
  expiresAt: {
    type: Date,
    default: null,
  },
});

userSchema.pre("save", function (next) {
  if (!this.name) {
    this.name = this.username;
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;