import { Router } from 'express';
import * as c from '../controllers/analyticsController.js';
import { authenticate, authorizeRole} from '../middleware/auth.js';

const r = Router();
r.use(authenticate);
r.get('/admin', authorizeRole('admin'), c.adminDashboard);
r.get('/teacher', authorizeRole('teacher'), c.teacherDashboard);
r.get('/student', authorizeRole('student'), c.studentDashboard);
export default r;