const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");

router.post("/", transactionController.addTransaction);
router.get("/", transactionController.showAllTransaction);
router.put("/", transactionController.edit);
router.delete("/:transactionId", transactionController.deleteTransaction);
router.get("/stats", transactionController.getTransactionStats);
module.exports = router;
