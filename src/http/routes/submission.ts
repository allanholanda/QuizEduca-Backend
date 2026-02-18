import { FastifyInstance } from 'fastify';
import { authenticate } from '../middlewares/auth';
import {
  startSubmission,
  submitAnswers,
  syncSubmissions,
  getSubmissionResults,
  getMySubmissions,
} from '../controllers/submission';

export async function submissionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post('/start', startSubmission);
  app.post('/:id/submit', submitAnswers);
  app.post('/sync', syncSubmissions);
  app.get('/:id', getSubmissionResults);
  app.get('/my', getMySubmissions);
}