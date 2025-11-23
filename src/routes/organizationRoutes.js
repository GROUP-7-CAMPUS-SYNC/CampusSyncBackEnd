import express from 'express'
import { seedOrganizations, getOrganizations, toggleFollowOrganization } from "../controllers/organizationalControllers.js";
import { protect } from "../middleware/authMiddleWare.js";


const router = express.Router();

router.post('/seed', seedOrganizations);
router.get('/get_organizations', protect, getOrganizations);
router.patch('/toggle_follow/:organizationID', protect, toggleFollowOrganization);

export default router;
