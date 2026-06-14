const jwt = require("jsonwebtoken");

const protectHomemaker = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET matches what you used while signing
      req.homemakerId = decoded.id; // this makes homemakerId available in request
      next();
    } catch (err) {
      return res.status(401).json({ message: "Token is not valid" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }
};

module.exports = { protectHomemaker };
