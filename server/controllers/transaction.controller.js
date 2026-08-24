const Transaction = require("../models/transactionSchema");
const asyncWrapper = require("../middleware/asyncWrapper");

function extractAmount(message) {
  const patterns = [
    /(?:مبلغ|amount)\s*(?:قدر[ه]?\s*)?(?:[:\-]?\s*)?([\d,]+(?:\.\d+)?)/i,

    /([\d,]+(?:\.\d+)?)\s*(?:EGP|L\.?E\.?|جنيه(?:\s*مصري)?)/i,

    /(?:EGP|L\.?E\.?|جنيه(?:\s*مصري)?)\s*([\d,]+(?:\.\d+)?)/i,
  ];

  for (const regex of patterns) {
    const match = message.match(regex);

    if (match) {
      return Number(match[1].replace(/,/g, ""));
    }
  }

  return null;
}

const addTransaction = asyncWrapper(async (req, res) => {
  const { message, sender, notes } = req.body;
  const amount = extractAmount(message);

  const transaction = await Transaction.create({
    message,
    sender,
    amount,
    profit: amount * 0.005,
    notes: notes || "",
    receivedAt: new Date(),
  });

  res.status(201).json({
    success: true,
    transaction,
  });
});

const showAllTransaction = asyncWrapper(async (req, res) => {
  const allTransactions = await Transaction.find();

  res.status(201).json({
    success: true,
    allTransactions,
  });
});
module.exports = { addTransaction, showAllTransaction };
