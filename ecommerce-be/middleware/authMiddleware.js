const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token Verification Error:', error);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

module.exports = authMiddleware;