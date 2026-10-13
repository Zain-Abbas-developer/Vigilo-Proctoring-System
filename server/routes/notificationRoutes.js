import { Router } from 'express';
import * as c from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';



const r = Router();
r.use(authenticate);
r.get('/', c.listNotifications);
r.get('/unread-count', c.unreadCount);
r.post('/:id/read', c.markRead);
r.post('/read-all', c.markAllRead);
export default r;