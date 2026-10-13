import { Router } from 'express';
import * as c from '../controllers/questionController.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import * as v from '../validators/questionValidators.js';


const r = Router();
r.use(authenticate);
r.get('/bank', authorizeRole('teacher', 'admin'), c.listQuestionBank);
r.put('/:id', authorizeRole('teacher', 'admin'), validateRequest(v.updateQuestionSchema), c.updateQuestion);
r.delete('/:id', authorizeRole('teacher', 'admin'), c.deleteQuestion);
export default r;