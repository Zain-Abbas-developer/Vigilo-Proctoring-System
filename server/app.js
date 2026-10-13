import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimit.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(env.isProd ? 'combined' : 'dev'));
app.use('/api', apiLimiter , routes);


app.get('/health', (req, res) => res.json({ success: true, message: 'Vigilo backend healthy', data: { uptime: process.uptime() } }));


app.use(notFound);
app.use(errorHandler);

export default app;