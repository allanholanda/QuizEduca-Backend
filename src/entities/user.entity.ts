import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Quiz } from './quiz.entity';
import { Submission } from './submission.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text'})
  name: string;

  @Column({ type: 'text', unique: true })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  role: 'teacher' | 'student';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Quiz, (quiz) => quiz.teacher)
  quizzes: Quiz[];

  @OneToMany(() => Submission, (submission) => submission.student)
  submissions: Submission[];
}