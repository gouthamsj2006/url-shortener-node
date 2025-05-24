const jwt = require('jsonwebtoken');

const JWT_SECRET = 'a-string-secret-at-least-256-bits-long'; // Use the same secret as in your token generation

module.exports = function (req, res, next) {
  // Get token from Authorization header ("Bearer <token>")
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer token"

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded payload (user id, etc.) to req.user
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
