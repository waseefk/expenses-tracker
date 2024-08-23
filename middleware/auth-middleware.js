const jwt = require("jsonwebtoken");
const config = require("../config");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.redirect("/auth/login"); // Redirect to login if token is invalid
  }
};

module.exports = authMiddleware;
