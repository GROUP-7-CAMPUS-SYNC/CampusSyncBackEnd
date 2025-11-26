import express from "express";
import { getAllOrganization, createOrganization, getAllUser, updateOrganizationName } from "../controllers/moderatorController.js";
import { protect } from "../middleware/authMiddleWare.js"


const router = express.Router();

router.get('/get_all_organizations', protect, getAllOrganization);
router.post('/create_organization', protect, createOrganization);
router.get('/get_all_users', protect, getAllUser);
router.post('/update_organization_name', protect, updateOrganizationName);


export default router;