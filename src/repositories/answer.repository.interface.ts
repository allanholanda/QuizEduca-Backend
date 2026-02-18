import { Answer } from '../entities/answer.entity';
import { BaseRepository } from './base';

export class AnswerRepository extends BaseRepository<Answer> {
  constructor() {
    super(Answer);
  }

  async createAnswers(answers: Partial<Answer>[]): Promise<Answer[]> {
    const ans = this.repo.create(answers);
    return this.repo.save(ans);
  }
}