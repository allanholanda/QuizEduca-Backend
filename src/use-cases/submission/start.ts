import { SubmissionRepository } from '../../repositories/submission.repository.interface';
import { QuizRepository } from '../../repositories/quiz.repository.interface';
import { AppError } from '../../utils/error';

export class StartSubmissionUseCase {
  constructor(
    private submissionRepository: SubmissionRepository,
    private quizRepository: QuizRepository,
  ) {}

  async execute(studentId: number, quizId: number) {
    const quiz = await this.quizRepository.findWithQuestions(quizId);
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    // Verificar se já existe uma submissão não finalizada
    const existing = await this.submissionRepository.findByStudentAndQuiz(studentId, quizId);
    if (existing && !existing.completed_at) {
      return existing; // retorna a submissão existente
    }

    // Criar nova submissão
    const submission = await this.submissionRepository.createSubmission({
      student_id: studentId,
      quiz_id: quizId,
      started_at: new Date(),
    });

    return submission;
  }
}