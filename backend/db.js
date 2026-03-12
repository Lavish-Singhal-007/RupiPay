const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");

mongoose.connect(MONGO_URI);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },
    firstName: { type: String, trim: true, required: true, maxlength: 50 },
    lastName: { type: String, trim: true, required: true, maxlength: 50 },
    password: { type: String, required: true, minlength: 6 },
    pin: {
      type: String,
      required: true,
      minLength: 4,
    },
  },
  { timestamps: true },
);

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
  totalSent: {
    type: Number,
    default: 0,
  },
  totalReceived: {
    type: Number,
    default: 0,
  },
  totalTransactions: {
    type: Number,
    default: 0,
  },
});

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },

    type: {
      type: String,
      enum: ["transfer", "deposit", "withdrawal"],
      default: "transfer",
    },

    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

transactionSchema.index({ fromUserId: 1, createdAt: -1 });
transactionSchema.index({ toUserId: 1, createdAt: -1 });

const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);
const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = {
  User,
  Account,
  Transaction,
};
