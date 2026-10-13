import { Router } from 'express';
import * as c from '../controllers/examController.js';
import * as qc from '../controllers/questionController.js';
import {authenticate, authorizeRole} from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import * as v from '../validators/examValidators.js';


const r = Router();
r.use(authenticate);
r.get('/', c.listExams);
r.post('/', authorizeRole('teacher', 'admin'), validateRequest(v.createExamSchema), c.createExam);
r.get('/:id', c.getExam);
r.put('/:id', authorizeRole('teacher', 'admin'), validateRequest(v.updateExamSchema), c.updateExam);
r.delete('/:id', authorizeRole('teacher', 'admin'), c.deleteExam);
r.post('/:id/publish', authorizeRole('teacher', 'admin'), c.publishExam);
r.post('/:id/assign', authorizeRole('teacher', 'admin'), validateRequest(v.assignStudentsSchema), c.assignStudents);

// questions nested under exam
r.get('/:examId/questions', authorizeRole('teacher', 'admin'), qc.listQuestions);
r.post('/:examId/questions', authorizeRole('teacher', 'admin'), qc.addQuestion);
r.post('/:examId/questions/bulk', authorizeRole('teacher', 'admin'), qc.bulkQuestions);
export default r;