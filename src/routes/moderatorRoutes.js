import express from "express";
import { getAllOrganization } from "../controllers/moderatorController.js";
import { protect } from "../middleware/authMiddleWare.js"


const router = express.Router();

router.get('/get_all_organizations', protect, getAllOrganization);

export default router;