import express from "express";
import { getUserPosts } from "../controllers/profileControllers.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get("/my-posts", protect, getUserPosts);

export default router;