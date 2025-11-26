import express from "express";
import { getAllOrganization, createOrganization } from "../controllers/moderatorController.js";
import { protect } from "../middleware/authMiddleWare.js"


const router = express.Router();

router.get('/get_all_organizations', protect, getAllOrganization);
router.post('/create_organization', protect, createOrganization);

export default router;