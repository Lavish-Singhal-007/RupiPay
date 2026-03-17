const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const accountRouter = require("./account");
const transactionRouter = require("./transaction");
const chatRouter = require("./chat");

// All routes starting with /user go to userRouter
router.use("/user", userRouter);

router.use("/account", accountRouter);

router.use("/transaction", transactionRouter);

router.use("/chat", chatRouter);

module.exports = router;
