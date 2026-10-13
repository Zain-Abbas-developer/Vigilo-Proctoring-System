import { Router } from 'express';
import * as c from '../controllers/resultController.js';
import { authenticate } from '../middleware/auth.js';


const r = Router();
r.use(authenticate);
r.get('/:attemptId', c.getResult);
export default r;