import { DataSource } from 'typeorm';
import { env } from '../../env';
import { User } from '../../entities/user.entity';
import { Quiz } from '../../entities/quiz.entity';
import { Question } from '../../entities/question.entity';
import { Submission } from '../../entities/submission.entity';
import { Answer } from '../../entities/answer.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
  entities: [User, Quiz, Question, Submission, Answer],
  logging: env.NODE_ENV === 'development',
})

AppDataSource.initialize()
  .then(() => {
    console.log('Database with typeorm connected')
  })
  .catch((error) => {
    console.error('Error connecting to database with typeorm', error)
  })
