import { Question } from '../../entities/question.entity';
import { BaseRepository } from '../base';

export class QuestionRepository extends BaseRepository<Question> {
  constructor() {
    super(Question);
  }

  async findByQuiz(quizId: number): Promise<Question[]> {
    return this.repo.find({ where: { quiz_id: quizId } });
  }

  async createQuestions(questions: Partial<Question>[]): Promise<Question[]> {
    const qs = this.repo.create(questions);
    return this.repo.save(qs);
  }
}