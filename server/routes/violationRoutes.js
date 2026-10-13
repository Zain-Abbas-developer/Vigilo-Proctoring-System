import { Router } from 'express';
import * as c from '../controllers/violationController.js';
import * as ac from '../controllers/attemptController.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import {recordViolationSchema} from '../validators/attemptValidators.js';


const r = Router();
r.use(authenticate);
r.post('/record', validateRequest(recordViolationSchema), ac.recordViolationEndpoint);
r.get('/', c.listViolations);
r.patch('/:id/review', authorizeRole('teacher', 'admin'), c.reviewViolation);
export default r;