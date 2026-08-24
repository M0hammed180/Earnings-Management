const express = require("express");
const router = express.Router();
const users = require("../controllers/users.controller");
const verifyToken = require("../middleware/verfiyToken");

router.post("/login", users.login);

router.get("/showall", verifyToken, users.showAllUsers);

router.post("/add", verifyToken, users.createUser);

router.post("/edit", users.edit);

module.exports = router;
