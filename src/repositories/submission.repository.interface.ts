import { Submission } from '../entities/submission.entity';
import { BaseRepository } from './base';

export class SubmissionRepository extends BaseRepository<Submission> {
  constructor() {
    super(Submission);
  }

  async findByIdWithAnswers(id: number): Promise<Submission | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['answers', 'answers.question', 'quiz', 'student'],
    });
  }

  async findByStudentAndQuiz(studentId: number, quizId: number): Promise<Submission | null> {
    return this.repo.findOne({
      where: { student_id: studentId, quiz_id: quizId },
      order: { created_at: 'DESC' },
    });
  }

  async findByStudent(studentId: number): Promise<Submission[]> {
    return this.repo.find({
      where: { student_id: studentId },
      relations: ['quiz'],
      order: { created_at: 'DESC' },
    });
  }

  async findByQuiz(quizId: number): Promise<Submission[]> {
    return this.repo.find({
      where: { quiz_id: quizId },
      relations: ['student'],
    });
  }

  async createSubmission(data: Partial<Submission>): Promise<Submission> {
    const sub = this.repo.create(data);
    return this.repo.save(sub);
  }

  async updateSubmission(id: number, data: Partial<Submission>): Promise<void> {
    await this.repo.update(id, data);
  }

  async findMySubmissions(studentId: number) {
    return this.repo.find({
      where: { student_id: studentId },
      relations: ['quiz', 'answers', 'answers.question'],
      order: { completed_at: 'DESC' },
    });
  }
}