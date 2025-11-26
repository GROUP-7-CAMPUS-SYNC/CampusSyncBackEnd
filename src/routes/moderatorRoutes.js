import express from "express";
import { getAllOrganization, createOrganization, getAllUser, updateOrganizationName, updateOrganizationDescription } from "../controllers/moderatorController.js";
import { protect } from "../middleware/authMiddleWare.js"


const router = express.Router();

router.get('/get_all_organizations', protect, getAllOrganization);
router.post('/create_organization', protect, createOrganization);
router.get('/get_all_users', protect, getAllUser);

router.put('/update_organization_name', protect, updateOrganizationName);
router.put('/update_organization_description', protect, updateOrganizationDescription);

export default router;