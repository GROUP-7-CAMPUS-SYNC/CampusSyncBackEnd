import express from "express";
import { 
    getManagedOrganization, 
    createPostAcademic, 
    getAllAcademicPosts,
    addCommentAcademic,
    getCommentsAcademic,
    editCommentAcademic,
    deleteCommentAcademic
} from "../controllers/academicController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

// Organization & Post Routes
router.get('/get_managed_organization', protect, getManagedOrganization);
router.post('/create_post', protect, createPostAcademic);
router.get('/getPosts/academic', protect, getAllAcademicPosts);

// Comment Routes
router.post('/:id/comments', protect, addCommentAcademic);           // Add
router.get('/:id/comments', protect, getCommentsAcademic);           // Read
router.put('/:id/comments/:commentId', protect, editCommentAcademic); // Edit
router.delete('/:id/comments/:commentId', protect, deleteCommentAcademic); // Delete

export default router;