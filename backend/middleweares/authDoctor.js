import jwt from "jsonwebtoken";

// doctor authentication middleware
const authDoctor = async (req, res, next) => {
  try {
    let dtoken = req.headers.authorization;

    if (!dtoken) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized. Login again.",
      });
    }

    // Remove "Bearer " if present
    if (dtoken.startsWith("Bearer ")) {
      dtoken = dtoken.split(" ")[1];
    }

    // Verify JWT
    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    // Attach user info to request
    req.doctor = { docId: decoded.id };

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({
      success: false,
      message: "Unauthorized or Invalid Token",
    });
  }
};

export default authDoctor;