require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  PORT: process.env.PORT || 3000, // for safety if .env do not have PORT
};
