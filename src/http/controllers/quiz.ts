import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateQuizUseCase } from '../../use-cases/quiz/create';
import { ListQuizzesUseCase } from '../../use-cases/quiz/list';
import { GetQuizUseCase } from '../../use-cases/quiz/get';
import { DeleteQuizUseCase } from '../../use-cases/quiz/delete';
import { QuizRepository } from '../../repositories/quiz.repository.interface';
import { QuestionRepository } from '../../repositories/question.repository.interface';
import { createQuizSchema, quizIdParamSchema } from '../schemas/quiz';
import { UpdateQuizUseCase } from '@/use-cases/quiz/update';
import { ListAllQuizzesUseCase } from '@/use-cases/quiz/list-all';

const quizRepository = new QuizRepository();
const questionRepository = new QuestionRepository();

export async function createQuiz(request: FastifyRequest, reply: FastifyReply) {
  const data = createQuizSchema.parse(request.body);
  const teacherId = request.user.id; // do middleware

  const createQuizUseCase = new CreateQuizUseCase(
    quizRepository,
    questionRepository,
  )
  const quiz = await createQuizUseCase.execute({ ...data, teacherId });
  return reply.status(201).send(quiz);
}

export async function updateQuiz(request: FastifyRequest, reply: FastifyReply) {
  const { id } = quizIdParamSchema.parse(request.params);
  const data = createQuizSchema.parse(request.body);
  const teacherId = request.user.id;

  const updateQuizUseCase = new UpdateQuizUseCase(quizRepository, questionRepository);
  const quiz = await updateQuizUseCase.execute({
    id,
    teacherId,
    ...data,
  });
  return reply.send(quiz);
}

export async function listQuizzes(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.user.id;
  const role = request.user.role;

  if (role === 'teacher') {
    const listUseCase = new ListQuizzesUseCase(quizRepository);
    const quizzes = await listUseCase.execute(userId);
    return reply.send(quizzes);
  } else {
    // student: retorna todos os quizzes
    const listAllUseCase = new ListAllQuizzesUseCase(quizRepository);
    const quizzes = await listAllUseCase.execute();
    return reply.send(quizzes);
  }
}

export async function getQuiz(request: FastifyRequest, reply: FastifyReply) {
  const { id } = quizIdParamSchema.parse(request.params);
  const teacherId =
    request.user.role === 'teacher' ? request.user.id : undefined
  const getUseCase = new GetQuizUseCase(quizRepository);
  const quiz = await getUseCase.execute(id, teacherId);
  return reply.send(quiz);
}

export async function deleteQuiz(request: FastifyRequest, reply: FastifyReply) {
  const { id } = quizIdParamSchema.parse(request.params);
  const teacherId = request.user.id;
  const deleteUseCase = new DeleteQuizUseCase(quizRepository);
  await deleteUseCase.execute(id, teacherId);
  return reply.status(204).send();
}