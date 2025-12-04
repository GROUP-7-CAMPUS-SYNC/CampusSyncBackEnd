import express from "express";
import { 
    getManagedOrganization, 
    createPostEvent, 
    getAllEventPosts,
    addCommentEvent,
    getCommentsEvent,
    editCommentEvent,
    deleteCommentEvent
} from "../controllers/eventControllers.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

// Organization & Post Routes
router.get('/get_managed_organization', protect, getManagedOrganization);
router.post('/create_post', protect, createPostEvent);
router.get('/getPosts/event', protect, getAllEventPosts);

// Comment Routes
router.post('/:id/comments', protect, addCommentEvent);           // Add
router.get('/:id/comments', protect, getCommentsEvent);           // Read
router.put('/:id/comments/:commentId', protect, editCommentEvent); // Edit
router.delete('/:id/comments/:commentId', protect, deleteCommentEvent); // Delete

export default router;