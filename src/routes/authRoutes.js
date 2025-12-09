import express from "express";
import { register } from "../controllers/authControllers/registerControllers.js";
import { login } from "../controllers/authControllers/loginControllers.js";
import { verifyUser } from "../controllers/authControllers/verifyController.js";
import {getMe } from "../controllers/authControllers/getMeControllers.js"
import { protect } from "../middleware/authMiddleWare.js";


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', protect, verifyUser);
router.get('/me', protect, getMe);


export default router;