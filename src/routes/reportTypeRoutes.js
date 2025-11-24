import express from 'express'
import { createReportItem, getAllReportItems } from '../controllers/reportItemController.js';
import { protect } from '../middleware/authMiddleWare.js';



const router = express.Router();

router.post('/createPost', protect, createReportItem);
router.get('/getPosts/reportItems', protect, getAllReportItems);

export default router;