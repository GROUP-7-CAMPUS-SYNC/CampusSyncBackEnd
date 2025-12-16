import express from "express";
import { getUserPosts, updateProfilePicture } from "../controllers/profileControllers.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get("/my-posts", protect, getUserPosts);
router.put("/update-picture", protect, updateProfilePicture);

export default router;