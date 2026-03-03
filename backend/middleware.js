const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = {
  authMiddleware,
};
