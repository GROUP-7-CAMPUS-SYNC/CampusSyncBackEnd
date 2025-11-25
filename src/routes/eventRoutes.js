import express from "express";
import { getManagedOrganization, createPostEvent, getAllEventPosts} from "../controllers/eventControllers.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get('/get_managed_organization', protect, getManagedOrganization);
router.post('/create_post', protect, createPostEvent);
router.get('/getPosts/event', protect, getAllEventPosts);

export default router;