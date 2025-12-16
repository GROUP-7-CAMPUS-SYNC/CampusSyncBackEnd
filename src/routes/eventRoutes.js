import express from "express";
import { 
    getManagedOrganization, 
    createPostEvent, 
    getAllEventPosts,
    addCommentEvent,
    toggleNotifyEvent,
    getEventSubscribers,
    deleteEvent,
    updateEvent
} from "../controllers/eventControllers.js";

import {
    updateEventComment,
    deleteEventComment
} from "../controllers/commentController.js"
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

// Organization & Post Routes
router.get('/get_managed_organization', protect, getManagedOrganization);
router.post('/create_post', protect, createPostEvent);
router.get('/getPosts/event', protect, getAllEventPosts);
router.delete('/delete/:id', protect, deleteEvent)
router.put('/update/:id', protect, updateEvent)

// Comment Routes
router.post('/:id/comments', protect, addCommentEvent);           // Add
router.put('/:postId/comments/:commentId', protect, updateEventComment);
router.delete('/:postId/comments/:commentId', protect, deleteEventComment); 

// Toggle Notify Me Routes
router.put('/toggle_notify/:id', protect, toggleNotifyEvent);
router.get('/get_notify_status/:id', protect, getEventSubscribers);

export default router;