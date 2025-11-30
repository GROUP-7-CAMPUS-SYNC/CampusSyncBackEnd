import express from "express";
import { getHomeFeed } from "../controllers/homeFeedController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get("/home", protect, getHomeFeed);

export default router;