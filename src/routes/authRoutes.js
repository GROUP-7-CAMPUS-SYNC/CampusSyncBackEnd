import express from "express";
import { register } from "../controllers/authControllers/registerControllers.js";
import { login } from "../controllers/authControllers/loginControllers.js";

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

export default router;