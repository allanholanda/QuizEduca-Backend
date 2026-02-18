import { Quiz } from '../entities/quiz.entity';
import { BaseRepository } from './base';

export class QuizRepository extends BaseRepository<Quiz> {
  constructor() {
    super(Quiz);
  }

  async findWithQuestions(id: number): Promise<Quiz | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['questions'],
    });
  }

  async findByTeacher(teacherId: number): Promise<Quiz[]> {
    return this.repo.find({
      where: { teacher_id: teacherId },
      relations: ['questions'],
      order: { created_at: 'DESC' },
    });
  }

  async createQuiz(data: Partial<Quiz>): Promise<Quiz> {
    const quiz = this.repo.create(data);
    return this.repo.save(quiz);
  }

  async deleteQuiz(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}