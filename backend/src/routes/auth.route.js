import express from "express";
import {
  login,
  logout,
  onboard,
  signup
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import User from "../models/User.js"; // <-- make sure this is imported

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/onboarding", protectRoute, onboard);

router.post("/choose-profile", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const { profilePic } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        profilePic,
        hasChosenProfile: true,
      },
      { new: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error setting profile:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

export default router;
