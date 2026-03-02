const express = require("express");
const router = express.Router();

const userRouter = require("./user");

// All routes starting with /user go to userRouter
router.use("/user", userRouter);

module.exports = router;
