const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Lấy token từ header

  if (!token) {
    return res.status(401).json({ status: 0, message: "No token provided!" });
  }

  try {
    const decoded = jwt.verify(token, "thanh"); // Giải mã token
    req.user = decoded; // { userId: xxx }
    next();
  } catch (err) {
    return res.status(403).json({ status: 0, message: "Invalid token!" });
  }
};

module.exports = verifyToken;
