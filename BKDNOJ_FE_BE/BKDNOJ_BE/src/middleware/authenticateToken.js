const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Token is required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;

// const jwt = require("jsonwebtoken");

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   const token = authHeader?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       error: "Access denied. No token provided",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         error: "Token expired",
//       });
//     }
//     return res.status(403).json({
//       success: false,
//       error: "Invalid token",
//     });
//   }
// };

// module.exports = authenticateToken;
