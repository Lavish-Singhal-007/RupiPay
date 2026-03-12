const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const { Transaction } = require("../db");

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ fromUserId: req.userId }, { toUserId: req.userId }],
    })
      .sort({ createdAt: -1 })
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
