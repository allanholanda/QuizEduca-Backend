import { QuizRepository } from '../../repositories/quiz.repository.interface';
import { AppError } from '../../utils/error';

export class GetQuizUseCase {
  constructor(private quizRepository: QuizRepository) {}

  async execute(quizId: number, teacherId?: number) {
    const quiz = await this.quizRepository.findWithQuestions(quizId);
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    // Se for professor, verificar se é o dono
    if (teacherId && quiz.teacher_id !== teacherId) {
      throw new AppError('Forbidden', 403);
    }

    return quiz;
  }
}