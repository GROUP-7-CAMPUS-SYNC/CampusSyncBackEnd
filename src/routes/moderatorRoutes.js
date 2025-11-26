import express from "express";
import { 
    getAllOrganization, 
    createOrganization, 
    getAllUser, 
    updateOrganizationName, 
    updateOrganizationDescription, 
    changeOrganizationHead,
    deleteOrganization 
} from "../controllers/moderatorController.js";
import { protect } from "../middleware/authMiddleWare.js"


const router = express.Router();

router.get('/get_all_organizations', protect, getAllOrganization);
router.get('/get_all_users', protect, getAllUser);

router.post('/create_organization', protect, createOrganization);

router.put('/update_organization_name', protect, updateOrganizationName);
router.put('/update_organization_description', protect, updateOrganizationDescription);
router.put('/change_organization_head', protect, changeOrganizationHead)

router.delete('/delete_organization/:organizationId', protect, deleteOrganization);


export default router;