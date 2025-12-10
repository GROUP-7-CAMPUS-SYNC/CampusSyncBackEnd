import express from "express";
import { 
    getManagedOrganization, 
    createPostAcademic, 
    getAllAcademicPosts,
    addCommentAcademic,
    deleteAcademicPost,
    updateAcademicPost
} from "../controllers/academicController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

// Organization & Post Routes
router.get('/get_managed_organization', protect, getManagedOrganization);
router.post('/create_post', protect, createPostAcademic);
router.get('/getPosts/academic', protect, getAllAcademicPosts);
router.delete('/delete/:id', protect, deleteAcademicPost)
router.put('/update/:id', protect, updateAcademicPost)


// Comment Routes
router.post('/:id/comments', protect, addCommentAcademic);           // Add

export default router;