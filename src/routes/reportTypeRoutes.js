import express from 'express';
import { 
    createReportItem, 
    getAllReportItems,
    addCommentReportItem,
    addWitness,
    isUserIsWitness,
    getWitnessList,
    deleteReportItem,
    updateReportItem
} from '../controllers/reportItemController.js';
import { protect } from '../middleware/authMiddleWare.js';

const router = express.Router();

// Post Routes
router.post('/createPost', protect, createReportItem);
router.get('/getPosts/reportItems', protect, getAllReportItems);
router.delete('/delete/:id', protect, deleteReportItem)
router.put('/update/:id', protect, updateReportItem)


// Comment Routes
router.post('/:id/comments', protect, addCommentReportItem);           // Add
// router.get('/:id/comments', protect, getCommentsReportItem);           // Read


// Witness Routes
router.post('/:id/witnesses', protect, addWitness);
router.get('/:id/witnesses', protect, isUserIsWitness);
router.get('/:id/witness-list', protect, getWitnessList); 


export default router;