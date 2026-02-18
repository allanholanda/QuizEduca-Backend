import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth';
import { getTeacherAnalytics } from '../controllers/analytics';

export async function analyticsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);
  app.get('/teacher', getTeacherAnalytics);
}