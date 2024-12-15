import express from 'express';
import { createUser, getAllUser, getUserById } from '../controllers/userController';
import rateLimit from 'express-rate-limit';


const router = express.Router();
let apiRateLimit = rateLimit({
    max: 10,
    windowMs: 15 * 60 * 1000,
    message: 'You have reached your limit of adding 10 items. Please wait 3 minutes before trying again'
});

router.post('/create', apiRateLimit, createUser);
router.get('/getAll', apiRateLimit, getAllUser);
router.get('/getById/:user_id', apiRateLimit, getUserById);

export { router as userRouter }