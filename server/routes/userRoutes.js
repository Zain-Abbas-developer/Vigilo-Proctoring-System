import { Router } from 'express';
import * as c from '../controllers/userController.js';
import { authenticate, authorizeRole } from '../middleware/auth.js';


const r = Router();
r.use(authenticate);
r.get('/', authorizeRole('admin'), c.listUsers);
r.post('/', authorizeRole('admin'), c.createUser);
r.get('/:id', c.getUser);
r.put('/:id', authorizeRole('admin'), c.updateUser);
r.patch('/:id/status', authorizeRole('admin'), c.updateUserStatus);
r.delete('/:id', authorizeRole('admin'), c.deleteUser);
// r.get('/student-data', authorizeRole('admin'), c.studentData);
export default r;