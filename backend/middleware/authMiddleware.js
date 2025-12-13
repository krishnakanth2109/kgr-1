const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // 1. Get token from header
  const token = req.header('x-auth-token');

  // 2. Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user to request object
    // Handle specific student/admin payloads or generic user payload
    if (decoded.student) {
        req.student = decoded.student;
        req.user = decoded.student; // Alias for generic routes
    } else if (decoded.admin) {
        req.admin = decoded.admin;
        req.user = decoded.admin;   // Alias for generic routes
    } else {
        req.user = decoded.user || decoded;
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;