const User = require("../models/User");
const Transaction = require("../models/Transaction");

const getDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const transactions =
      await Transaction.find({ userId });

    const totalTransactions =
      transactions.length;

    const totalDebit = transactions
      .filter((t) => t.type === "Debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalCredit = transactions
      .filter((t) => t.type === "Credit")
      .reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      balance: user.balance,
      totalTransactions,
      totalDebit,
      totalCredit,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardData,
};