const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const { Session } = require("./db");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const session = await Session.findOne({ token, userId: decoded.userId });

    if (!session) {
      return res.status(401).json({ message: "Session expired or logged out" });
    }
    req.userId = decoded.userId;
    req.token = token;
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
