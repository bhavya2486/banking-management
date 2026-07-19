const User = require("../models/User");
const Transaction = require("../models/Transaction");

const transferFunds = async (req, res) => {
  try {
    const {
      senderAccount,
      receiverAccount,
      amount,
      remark,
    } = req.body;

    const transferAmount = Number(amount);

    if (transferAmount <= 0) {
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    const sender = await User.findOne({
      accountNumber: Number(senderAccount),
    });

    if (!sender) {
      return res.status(404).json({
        message: "Sender account not found",
      });
    }

    const receiver = await User.findOne({
      accountNumber: Number(receiverAccount),
    });

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver account not found",
      });
    }

    if (
      sender.accountNumber ===
      receiver.accountNumber
    ) {
      return res.status(400).json({
        message:
          "Cannot transfer to your own account",
      });
    }

    if (sender.balance < transferAmount) {
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    sender.balance -= transferAmount;
    receiver.balance += transferAmount;

    await sender.save();
    await receiver.save();

    // Sender Transaction (Debit)

    await Transaction.create({
      userId: sender._id,
      senderAccount: sender.accountNumber,
      receiverAccount: receiver.accountNumber,
      accountNumber: receiver.accountNumber,
      receiverName: receiver.name,
      amount: transferAmount,
      type: "Debit",
      remark,
    });

    // Receiver Transaction (Credit)

    await Transaction.create({
      userId: receiver._id,
      senderAccount: sender.accountNumber,
      receiverAccount: receiver.accountNumber,
      accountNumber: sender.accountNumber,
      receiverName: sender.name,
      amount: transferAmount,
      type: "Credit",
      remark,
    });

    res.status(200).json({
      message: "Transfer Successful",
      currentBalance: sender.balance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const { accountNumber, startDate, endDate } = req.query;
    let query = {};

    if (accountNumber) {
      const accNum = Number(accountNumber);
      if (!isNaN(accNum)) {
        query.$or = [
          { senderAccount: accNum },
          { receiverAccount: accNum }
        ];
      }
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const transactions = await Transaction.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  transferFunds,
  getTransactions,
  getAllTransactions,
};