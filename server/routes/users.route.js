const express = require("express");
const router = express.Router();
const users = require("../controllers/users.controller");

router.post("/login", users.login);
router.get("/", users.showAllUsers);
router.post("/add", users.createUser);
router.put("/", users.edit);
router.delete("/:userId", users.deleteUser);

module.exports = router;
