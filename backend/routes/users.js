// routes/users.js
import express from "express";
import { updateProfile, deleteAccount } from "../controllers/authcontroller.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Profile management routes
router.put("/profile", auth, updateProfile);
router.delete("/profile", auth, deleteAccount);

export default router;
