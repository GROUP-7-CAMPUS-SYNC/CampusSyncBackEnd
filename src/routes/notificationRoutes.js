import express from "express";
import { getNotification, markAsRead } from "../controllers/notificationControllers.js"; 
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get("/getNotification", protect, getNotification);

router.patch("/markAsRead/:notificationId", protect, markAsRead);

export default router;