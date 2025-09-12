import jwt from "jsonwebtoken";

// User authentication middleware
const authUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login again.",
      });
    }

    // Remove "Bearer " if present
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({
      success: false,
      message: "Unauthorized or Invalid Token",
    });
  }
};

export default authUser;
