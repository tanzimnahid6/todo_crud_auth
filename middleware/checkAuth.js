const jwt = require("jsonwebtoken");
require("dotenv").config();
const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userName, userId } = decoded;
    (req.userName = userName), (req.userId = userId);
    next();
  } catch (error) {
    next("Authentication error in middleware");
  }
};

module.exports = checkAuth;
