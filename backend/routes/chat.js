const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware");
const { Message } = require("../db");
const mongoose = require("mongoose");

router.get("/history/:otherUserId", authMiddleware, async (req, res) => {
  try {
    const otherUserId = new mongoose.Types.ObjectId(req.params.otherUserId);
    const messages = await Message.find({
      $or: [
        { senderId: req.userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: req.userId },
      ],
    })
      .populate("transactionId")
      .sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching history",
    });
  }
});

router.post("/send", authMiddleware, async (req, res) => {
  const { receiverId, content } = req.body;

  const newMessage = await Message.create({
    senderId: req.userId,
    receiverId,
    type: "TEXT",
    content,
  });

  res.status(200).json(newMessage);
});

module.exports = router;
