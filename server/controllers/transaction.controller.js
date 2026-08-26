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

function getTransactionType(message) {
  const text = message.replace(/\s+/g, " ").trim();

  if (
    /تم\s*(?:استلام|إضافة|اضافة|إيداع|ايداع)/i.test(text) ||
    /(?:استلمت|وصلني|تم\s+إرسال\s+إليك|تم\s+تحويل\s+إليك)/i.test(text)
  ) {
    return "received";
  }

  if (
    /تم\s*(?:تحويل|إرسال|ارسال|خصم|سحب|دفع)/i.test(text) ||
    /(?:حولت|أرسلت|ارسلت|خصم\s+من|سحبت|دفعت)/i.test(text)
  ) {
    return "send";
  }

  return null;
}

const addTransaction = asyncWrapper(async (req, res) => {
  const { message, name, sender, notes, type, receivedAt, amount } = req.body;

  const extractedAmount =
    amount != null ? Number(amount) : extractAmount(message);

  const finalType = type || getTransactionType(message);

  if (!finalType) {
    return res.status(400).json({
      success: false,
      message: "Could not determine transaction type",
    });
  }

  const transaction = await Transaction.create({
    message,
    name,
    sender,
    amount: extractedAmount,
    profit: extractedAmount ? extractedAmount * 0.005 : 0,
    notes: notes || "",
    type: finalType,
    receivedAt: receivedAt || new Date(),
  });

  res.status(201).json({
    success: true,
    transaction,
  });
});

const edit = asyncWrapper(async (req, res) => {
  const { amount, sender, notes, type, transactionId } = req.body;

  const update = {
    amount,
    sender,
    notes,
    type,
  };

  if (amount !== undefined) {
    update.profit = amount * 0.005;
  }

  const editedTransaction = await Transaction.findByIdAndUpdate(
    transactionId,
    update,
  );

  return res.status(200).json({
    success: true,
    message: "Transaction edited successfully",
    transaction: editedTransaction,
  });
});

const deleteTransaction = asyncWrapper(async (req, res) => {
  const { transactionId } = req.params;

  const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

  return res.status(200).json({
    success: true,
    message: "Transaction deleted successfully",
    transaction: deletedTransaction,
  });
});

const showAllTransaction = asyncWrapper(async (req, res) => {
  const allTransactions = await Transaction.find();

  res.status(200).json({
    success: true,
    allTransactions,
  });
});

const getTransactionStats = asyncWrapper(async (req, res) => {
  const stats = await Transaction.aggregate([
    {
      $group: {
        _id: null,
        netAmount: {
          $sum: {
            $cond: [
              { $eq: ["$type", "received"] },
              "$amount",
              {
                $cond: [
                  { $eq: ["$type", "send"] },
                  { $multiply: ["$amount", -1] },
                  0,
                ],
              },
            ],
          },
        },
        totalProfit: {
          $sum: {
            $cond: [
              { $eq: ["$type", "received"] },
              "$profit",
              {
                $cond: [
                  { $eq: ["$type", "send"] },
                  { $multiply: ["$profit", +0] },
                  0,
                ],
              },
            ],
          },
        },
        totalTransactions: { $sum: 1 },
      },
    },
  ]);

  const result =
    stats.length > 0
      ? stats[0]
      : { netAmount: 0, totalProfit: 0, totalTransactions: 0 };

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = {
  getTransactionStats,
  addTransaction,
  showAllTransaction,
  edit,
  deleteTransaction,
};
