const express = require("express");
const router = express.Router();

const userRouter = require("./user");
const accountRouter = require("./account");

// All routes starting with /user go to userRouter
router.use("/user", userRouter);

router.use("/account", accountRouter);

module.exports = router;
