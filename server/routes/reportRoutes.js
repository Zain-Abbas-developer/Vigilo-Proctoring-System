import { Router } from 'express';
import * as c from '../controllers/reportController.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';

const r = Router();
r.use(authenticate);
r.get('/', authorizeRole('teacher', 'admin'), c.listReports);
r.get('/analytics', authorizeRole('teacher', 'admin'), c.analyticsReport);
r.post('/exam/:examId', authorizeRole('teacher', 'admin'), c.generateExamReport);
r.get('/:id', authorizeRole('teacher', 'admin'), c.getReport);
export default r;