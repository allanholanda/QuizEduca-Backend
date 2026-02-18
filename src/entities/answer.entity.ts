import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm'
import { Submission } from './submission.entity';
import { Question } from './question.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'submission_id' })
  submission_id: number;

  @ManyToOne(() => Submission, (submission) => submission.answers)
  @JoinColumn({ name: 'submission_id' })
  submission: Submission;

  @Column({ type: 'integer', name: 'question_id' })
  question_id: number;

  @ManyToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'jsonb' })
  selected_option: any;

  @Column({ type: 'boolean', nullable: true })
  is_correct: boolean | null;

  @CreateDateColumn()
  created_at: Date;
}