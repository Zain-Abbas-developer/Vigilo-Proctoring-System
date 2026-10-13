import { Router } from 'express';
import * as c from '../controllers/attemptController.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import * as v from '../validators/attemptValidators.js';


const r = Router();
r.use(authenticate);

// student flow
r.post('/exam/:examId/start', authorizeRole('student'), c.startAttempt);
r.get('/exam/:examId/active', authorizeRole('student'), c.getActiveAttempt);
r.get('/exam/:examId/paper', authorizeRole('student'), c.getExamPaper);

r.post('/:attemptId/answer', authorizeRole('student'), validateRequest(v.saveAnswerSchema), c.saveAnswer);
r.post('/:attemptId/submit', validateRequest(v.submitSchema), c.submitAttempt);
r.post('/:attemptId/verify-face', authorizeRole('student'), c.verifyFaceForAttempt);

// listing / viewing
r.get('/', c.listAttempts);
r.get('/:id', c.getAttempt);
export default r;