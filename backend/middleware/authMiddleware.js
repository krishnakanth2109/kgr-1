const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // 1. Get the token from the header
  const token = req.header('x-auth-token');

  // 2. Check if token exists
  if (!token) {
    console.log("Auth Middleware: No token provided.");
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // FIX: Attach BOTH types of users if they exist in the payload
    // This makes the middleware work for both Admin and Student routes
    if (decoded.admin) {
        req.admin = decoded.admin;
        req.userType = 'admin';
    } 
    
    if (decoded.student) {
        req.student = decoded.student;
        req.userType = 'student';
    }

    next();
  } catch (err) {
    // Log the specific error (Expired? Invalid signature?)
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ message: 'Token is not valid or expired' });
  }
};

module.exports = authMiddleware;