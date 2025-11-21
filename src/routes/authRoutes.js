import express from "express";
import { register } from "../controllers/authControllers/registerControllers.js";
import { login } from "../controllers/authControllers/loginControllers.js";
import { verifyUser } from "../controllers/authControllers/verifyController.js";
import { protect } from "../middleware/authMiddleWare.js";


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', protect, verifyUser);


export default router;