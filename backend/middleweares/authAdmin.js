// backend/middleweares/authAdmin.js
import jwt from 'jsonwebtoken';

// Admin authentication middleware
export const protect = async (req, res, next) => {
  try {
    // Get the admin token from headers
    const atoken = req.headers.atoken;

    if (!atoken) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not Authorized. Login again.' 
      });
    }

    // Verify the token
    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    // Check if the token belongs to the admin
    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not Authorized. Invalid Token.' 
      });
    }

    // If everything is fine, proceed to next middleware/controller
    next();

  } catch (error) {
    console.error('Admin auth error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
