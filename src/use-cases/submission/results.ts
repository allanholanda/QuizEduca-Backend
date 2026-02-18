import { SubmissionRepository } from '../../repositories/submission.repository.interface';
import { AppError } from '../../utils/error';

export class GetSubmissionResultsUseCase {
  constructor(private submissionRepository: SubmissionRepository) {}

  async execute(submissionId: number, userId: number, role: string) {
    const submission =
      await this.submissionRepository.findByIdWithAnswers(submissionId)
    if (!submission) {
      throw new AppError('Submission not found', 404);
    }

    // Aluno só pode ver suas próprias submissões
    if (role === 'student' && submission.student_id !== userId) {
      throw new AppError('Forbidden', 403);
    }

    // Professor só pode ver submissões dos seus quizzes
    if (role === 'teacher') {
      // Garantir que o quiz foi carregado
      if (!submission.quiz) {
        throw new AppError('Quiz data missing', 500);
      }
      if (submission.quiz.teacher_id !== userId) {
        throw new AppError('Forbidden', 403);
      }
    }

    return submission;
  }
}