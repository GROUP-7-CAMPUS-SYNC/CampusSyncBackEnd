import express from "express";
import { toggleSavePost, getSavedPosts, checkSavedStatus } from "../controllers/savedController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/toggle", protect, toggleSavePost);
router.get("/all", protect, getSavedPosts);
router.get("/check/:type/:postId", protect, checkSavedStatus);

export default router;