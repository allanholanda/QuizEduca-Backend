import { QuizRepository } from '../../repositories/quiz.repository.interface';

export class ListAllQuizzesUseCase {
  constructor(private quizRepository: QuizRepository) {}

  async execute() {
    return this.quizRepository.repo.find({
      relations: ['questions'],
      order: { created_at: 'DESC' },
    });
  }
}