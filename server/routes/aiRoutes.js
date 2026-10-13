import { Router } from 'express';
import * as c from '../controllers/aiController.js';
import { authenticate } from '../middleware/auth.js';

const r = Router();

r.get('/health', c.aiHealth);

r.post('/face/enroll', authenticate, c.enroll);
r.post('/face/verify', authenticate, c.verify);

export default r;