import express from "express";
import { logSearchInteraction, getRecentSearches } from "../controllers/searchBarControllers.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

// POST: Log a click (frontend calls this when user clicks a search result)
router.post("/log", protect, logSearchInteraction);

// GET: Get history (frontend calls this when search bar is focused)
// Usage: /api/search/recent?context=global  OR  /api/search/recent?context=event
router.get("/recent", protect, getRecentSearches);


export default router;