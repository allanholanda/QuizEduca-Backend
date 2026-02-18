import { QuizRepository } from '../../repositories/quiz.repository.interface';

export class ListQuizzesUseCase {
  constructor(private quizRepository: QuizRepository) {}

  async execute(teacherId: number) {
    return this.quizRepository.findByTeacher(teacherId);
  }
}