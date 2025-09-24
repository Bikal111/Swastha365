// backend/middleweares/authUser.js
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login again.",
      });
    }

    const token = authHeader.split(" ")[1]; // remove "Bearer "
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object
    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    console.error("Auth Error:", error?.message || error);
    res.status(401).json({
      success: false,
      message: "Unauthorized or Invalid Token",
    });
  }
};

// Default export
export default authUser;
