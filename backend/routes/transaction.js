const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const { Transaction, Account } = require("../db");

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ fromUserId: req.userId }, { toUserId: req.userId }],
    })
      .sort({ createdAt: -1 })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    const formattedTransactions = transactions.map((t) => {
      const isSent = t.fromUserId._id.toString() === req.userId;
      return {
        id: t._id,
        name: isSent
          ? `${t.toUserId.firstName} ${t.toUserId.lastName}`
          : `${t.fromUserId.firstName} ${t.fromUserId.lastName}`,
        amount: t.amount / 100,
        type: isSent ? "sent" : "received",
        date: t.createdAt,
      };
    });

    res.status(200).json({ formattedTransactions });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transactions",
    });
  }
});

router.get("/recent", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ fromUserId: req.userId }, { toUserId: req.userId }],
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    const formattedTransactions = transactions.map((t) => {
      const isSent = t.fromUserId._id.toString() === req.userId;
      return {
        id: t._id,
        name: isSent
          ? `${t.toUserId.firstName} ${t.toUserId.lastName}`
          : `${t.fromUserId.firstName} ${t.fromUserId.lastName}`,
        amount: t.amount / 100,
        type: isSent ? "sent" : "received",
        date: t.createdAt,
      };
    });

    res.status(200).json({ formattedTransactions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent transactions" });
  }
});

router.get("/sent", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      fromUserId: req.userId,
    })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    res.status(200).json({
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transactions",
    });
  }
});

router.get("/received", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      toUserId: req.userId,
    })
      .populate("fromUserId", "firstName lastName")
      .populate("toUserId", "firstName lastName");

    res.status(200).json({
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transactions",
    });
  }
});

router.get("/total", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });

    const moneySent = account.totalSent / 100;
    const moneyReceived = account.totalReceived / 100;
    const transactions = account.totalTransactions;

    res.status(200).json({
      moneySent,
      moneyReceived,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching transactions",
    });
  }
});

module.exports = router;
