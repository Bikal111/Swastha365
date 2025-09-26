import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  refreshAccessToken,
} from "../controllers/userController.js";
import { protect } from "../middleweares/authAdmin.js";
import upload from "../middleweares/multer.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post("/update-profile", protect, upload.single("image"), updateUserProfile);
router.post("/refresh", refreshAccessToken);

export default router;
