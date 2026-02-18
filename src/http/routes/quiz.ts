import { FastifyInstance } from 'fastify';
import { authenticate, requireTeacher } from '../middlewares/auth';
import {
  createQuiz,
  listQuizzes,
  getQuiz,
  deleteQuiz,
  updateQuiz
} from '../controllers/quiz';

export async function quizRoutes(app: FastifyInstance) {
  app.addHook('onRequest', authenticate);

  app.post('/', { preHandler: requireTeacher }, createQuiz);
  app.get('/', listQuizzes);
  app.get('/:id', getQuiz);
  app.put('/:id', { preHandler: requireTeacher }, updateQuiz);
  app.delete('/:id', { preHandler: requireTeacher }, deleteQuiz);
}