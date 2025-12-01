import express from "express";
import { generateSignature } from "../controllers/uploadController.js";
import { protect } from "../middleware/authMiddleWare.js";


const router = express.Router();

router.get('/generate_signature', protect, generateSignature);

export default router;