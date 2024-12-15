import express from 'express';
import { userLogin } from '../controllers/authController';
import rateLimit from 'express-rate-limit';

const router = express.Router();
let apiRateLimit = rateLimit({
    max: 5,
    windowMs: 15 * 60 * 1000,
    message: 'You have reached your limit of logging 5 times!, Please wait 3 minutes before trying again'
});

router.post('/login', apiRateLimit, userLogin);

export { router as authRouter }


