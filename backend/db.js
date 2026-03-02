const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/paytm-app");

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
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
