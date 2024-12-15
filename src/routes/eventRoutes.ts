import express from 'express';
import rateLimit from 'express-rate-limit';
import { createEvent, getEvents, getEventMetrics } from '../controllers/eventController';


const router = express.Router();
let apiRateLimit = rateLimit({
    max: 10,
    windowMs: 15 * 60 * 1000,
    message: 'You have reached your limit of adding 10 items. Please wait 3 minutes before trying again'
});

router.post('/create', apiRateLimit, createEvent);
router.get('/retrive', apiRateLimit, getEvents);
router.get('/metrics', apiRateLimit, getEventMetrics);


export { router as eventRouter }