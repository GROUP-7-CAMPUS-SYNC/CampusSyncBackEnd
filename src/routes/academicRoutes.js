import express from "express";
import { getManagedOrganization, createPostAcademic, getAllAcademicPosts } from "../controllers/academicController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get('/get_managed_organization', protect, getManagedOrganization);
router.post('/create_post', protect, createPostAcademic);
router.get('/getPosts/academic', protect, getAllAcademicPosts);

export default router