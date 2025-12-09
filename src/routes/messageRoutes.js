import express from 'express';
import { protect } from '../middleware/authMiddleWare.js';
import { 
    sendMessage, 
    getConversation, 
    getChatPartners,
    markMessagesAsRead
} from '../controllers/messageControllers.js';

const router = express.Router();


router.get('/partners/list', protect, getChatPartners);

router.post('/send/:id', protect, sendMessage);
router.get('/:id', protect, getConversation);
router.put('/markAsRead/:id', protect, markMessagesAsRead);


export default router;