const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

router.post("/", transactionController.addTransaction);
router.get("/", transactionController.showAllTransaction);

module.exports = router;
