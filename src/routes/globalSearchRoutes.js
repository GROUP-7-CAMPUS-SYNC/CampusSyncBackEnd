import express from "express";
import { performGlobalSearch } from "../controllers/globalSearchBar.js"; 
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

// GET /api/search/global?search=term
router.get("/getGlobalSearch", protect, performGlobalSearch);

export default router;