import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import Attempt from '../models/Attempt.js';

let io = null;

export function initSockets(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.clientUrl, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Auth token required'));
    try {
      const payload = jwt.verify(token, env.jwtSecret);
      socket.user = payload;
      next();
    } catch { next(new Error('Invalid token')); }
  });

  io.on('connection', (socket) => {
    logger.info('Socket connected', { userId: socket.user.sub, role: socket.user.role });

    socket.on('join:exam', async ({ examId, attemptId }) => {
      socket.join(`exam:${examId}`);
      socket.join(`attempt:${attemptId}`);
      if (socket.user.role === 'student') {
        await Attempt.findByIdAndUpdate(attemptId, { lastHeartbeatAt: new Date() }).catch(() => {});
      }
    });

    socket.on('leave:exam', ({ examId }) => socket.leave(`exam:${examId}`));

    socket.on('proctor:event', async (payload = {}) => {
      const { attemptId, type, description, metadata } = payload;
      if (!attemptId || !type) return;
      const { recordViolation } = await import('../services/violationService.js');
      try { await recordViolation({ attemptId, type, description, metadata }); }
      catch (err) { logger.error('Failed to record proctor event', { message: err.message }); }
    });

    socket.on('proctor:heartbeat', async ({ attemptId }) => {
      if (!attemptId) return;
      await Attempt.findByIdAndUpdate(attemptId, { lastHeartbeatAt: new Date() }).catch(() => {});
      socket.emit('proctor:heartbeat:ack', { at: Date.now() });
    });

    socket.on('disconnect', () => {
      logger.info('Socket disconnected', { userId: socket.user.sub });
    });
  });

  return io;
}

export function emitToRoom(room, event, payload) {
  if (io) io.to(room).emit(event, payload);
}

export function getIO() { return io; }
