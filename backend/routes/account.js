const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const { User, Account, Transaction } = require("../db");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

router.get("/balance", authMiddleware, async (req, res) => {
  try {
    const account = await Account.findOne({
      userId: req.userId,
    });

    const user = await User.findById(req.userId);

    if (!account) {
      return res.status(404).json({
        message: "Account not found",
      });
    }
    return res.status(200).json({
      firstName: user.firstName,
      balance: account.balance / 100,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching balance",
    });
  }
});

router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let { to, amount, pin } = req.body;

  try {
    amount = amount * 100; // converting in paise
    const fromAccount = await Account.findOne({
      userId: req.userId,
    }).session(session);

    const user = await User.findById(req.userId).session(session);

    const isPinValid = await bcrypt.compare(pin, user.pin);
    if (!isPinValid) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Incorrect PIN",
      });
    }

    if (!fromAccount || fromAccount.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }

    const toAccount = await Account.findOne({
      userId: to,
    }).session(session);

    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }

    if (to === req.userId) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Cannot transfer to self",
      });
    }

    if (!amount || amount <= 0) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid amount",
      });
    }

    await Account.updateOne(
      {
        userId: req.userId,
      },
      { $inc: { balance: -amount, totalSent: amount, totalTransactions: 1 } },
    ).session(session);

    await Account.updateOne(
      {
        userId: to,
      },
      {
        $inc: { balance: amount, totalReceived: amount, totalTransactions: 1 },
      },
    ).session(session);

    const transactionId = "RP" + Date.now() + Math.floor(Math.random() * 1000);
    await Transaction.create(
      [
        {
          transactionId: transactionId,
          fromUserId: req.userId,
          toUserId: to,
          amount: amount,
          status: "success",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return res.status(200).json({
      message: "Transfer successful",
    });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    return res.status(500).json({
      message: "Transfer failed",
    });
  } finally {
    session.endSession();
  }
});

module.exports = router;
