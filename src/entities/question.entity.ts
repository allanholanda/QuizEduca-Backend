import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm'
import { Quiz } from './quiz.entity';
import { Answer } from './answer.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'quiz_id' })
  quiz_id: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', length: 20 })
  type: 'multiple_choice' | 'true_false';

  @Column({ type: 'jsonb', nullable: true })
  options: string[] | null;

  @Column({ type: 'jsonb' })
  correct_answer: any; // string | boolean | number

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];
}