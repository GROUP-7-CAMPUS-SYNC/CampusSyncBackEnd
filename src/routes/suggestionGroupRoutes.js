import express from "express";
import { seedSuggestionGroups, getSuggestions } from "../controllers/topBarControlles/suggestionControllers.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post('/seed', seedSuggestionGroups);
router.get('/group_suggestions', protect, getSuggestions);

export default router;