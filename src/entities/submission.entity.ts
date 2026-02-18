import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { User } from './user.entity';
import { Quiz } from './quiz.entity';
import { Answer } from './answer.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'quiz_id' })
  quiz_id: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.submissions)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @Column({ type: 'integer', name: 'student_id' })
  student_id: number;

  @ManyToOne(() => User, (user) => user.submissions)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @Column({ type: 'timestamp', nullable: true })
  started_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  completed_at: Date | null;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number | null;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Answer, (answer) => answer.submission, { cascade: true })
  answers: Answer[];
}