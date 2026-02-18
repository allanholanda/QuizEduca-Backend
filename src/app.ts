import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import { env } from './env';
import { authRoutes } from './http/routes/auth';
import { quizRoutes } from './http/routes/quiz';
import { submissionRoutes } from './http/routes/submission';
import { errorHandler } from './http/middlewares/error-handler';
import { analyticsRoutes } from './http/routes/analytics';

export const app = fastify();

app.register(cors, {
  origin: true,
});

app.register(jwt, {
  secret: env.JWT_SECRET,
});

app.register(authRoutes, { prefix: '/auth' });
app.register(quizRoutes, { prefix: '/quizzes' });
app.register(submissionRoutes, { prefix: '/submissions' });
app.register(analyticsRoutes, { prefix: '/analytics' });

app.setErrorHandler(errorHandler);