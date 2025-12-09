import express from "express";
import { 
    getManagedOrganization, 
    createPostEvent, 
    getAllEventPosts,
    addCommentEvent,
    toggleNotifyEvent,
    getEventSubscribers,
    deleteEvent
} from "../controllers/eventControllers.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

// Organization & Post Routes
router.get('/get_managed_organization', protect, getManagedOrganization);
router.post('/create_post', protect, createPostEvent);
router.get('/getPosts/event', protect, getAllEventPosts);
router.delete('/delete/:id', protect, deleteEvent)

// Comment Routes
router.post('/:id/comments', protect, addCommentEvent);           // Add


// Toggle Notify Me Routes
router.put('/toggle_notify/:id', protect, toggleNotifyEvent);
router.get('/get_notify_status/:id', protect, getEventSubscribers);

export default router;