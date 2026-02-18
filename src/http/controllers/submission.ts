import { FastifyReply, FastifyRequest } from 'fastify';
import { StartSubmissionUseCase } from '../../use-cases/submission/start';
import { SubmitAnswersUseCase } from '../../use-cases/submission/submit';
import { SyncSubmissionsUseCase } from '../../use-cases/submission/sync';
import { GetSubmissionResultsUseCase } from '../../use-cases/submission/results';
import { SubmissionRepository } from '../../repositories/submission.repository.interface';
import { QuizRepository } from '../../repositories/quiz.repository.interface';
import { AnswerRepository } from '../../repositories/answer.repository.interface';
import {
  startSubmissionSchema,
  submitAnswersSchema,
  syncSubmissionsSchema,
} from '../schemas/submission'
import { quizIdParamSchema } from '../schemas/quiz';

const submissionRepository = new SubmissionRepository();
const quizRepository = new QuizRepository();
const answerRepository = new AnswerRepository();

export async function startSubmission(request: FastifyRequest, reply: FastifyReply) {
  const { quizId } = startSubmissionSchema.parse(request.body);
  const studentId = request.user.id;

  const startUseCase = new StartSubmissionUseCase(submissionRepository, quizRepository);
  const submission = await startUseCase.execute(studentId, quizId);
  return reply.send(submission);
}

export async function submitAnswers(request: FastifyRequest, reply: FastifyReply) {
  const { id } = quizIdParamSchema.parse(request.params); // submissionId
  const data = submitAnswersSchema.parse(request.body);
  const studentId = request.user.id;

  const submitUseCase = new SubmitAnswersUseCase(submissionRepository, answerRepository, quizRepository);
  const result = await submitUseCase.execute({
    submissionId: id,
    studentId,
    answers: data.answers,
    completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
  });
  return reply.send(result);
}

export async function syncSubmissions(request: FastifyRequest, reply: FastifyReply) {
  const data = syncSubmissionsSchema.parse(request.body);
  const studentId = request.user.id;

  const syncUseCase = new SyncSubmissionsUseCase(submissionRepository, quizRepository, answerRepository);
  const results = await syncUseCase.execute({ studentId, submissions: data.submissions });
  return reply.send(results);
}

export async function getSubmissionResults(request: FastifyRequest, reply: FastifyReply) {
  const { id } = quizIdParamSchema.parse(request.params);
  const userId = request.user.id;
  const role = request.user.role;

  const resultsUseCase = new GetSubmissionResultsUseCase(submissionRepository);
  const submission = await resultsUseCase.execute(id, userId, role);
  return reply.send(submission);
}

export async function getMySubmissions(request: FastifyRequest, reply: FastifyReply) {
  const studentId = request.user.id;
  const submissions = await submissionRepository.findMySubmissions(studentId);
  return reply.send(submissions);
}