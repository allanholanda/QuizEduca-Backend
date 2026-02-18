import { QuizRepository } from '../../repositories/quiz.repository.interface';
import { QuestionRepository } from '../../repositories/question.repository.interface';
import { AppError } from '../../utils/error';

interface CreateQuizRequest {
  title: string;
  description?: string;
  teacherId: number;
  questions: {
    text: string;
    type: 'multiple_choice' | 'true_false';
    options?: string[];
    correct_answer: any;
  }[];
}

export class CreateQuizUseCase {
  constructor(
    private quizRepository: QuizRepository,
    private questionRepository: QuestionRepository,
  ) {}

  async execute(data: CreateQuizRequest) {
    // Validar questões
    for (const q of data.questions) {
      if (q.type === 'multiple_choice' && (!q.options || q.options.length < 2)) {
        throw new AppError('Multiple choice questions must have at least 2 options');
      }
      if (q.type === 'true_false' && ![true, false].includes(q.correct_answer)) {
        throw new AppError('True/false correct answer must be true or false');
      }
    }

    const quiz = await this.quizRepository.createQuiz({
      title: data.title,
      description: data.description,
      teacher_id: data.teacherId,
    });

    const questions = data.questions.map((q) => ({
      quiz_id: quiz.id,
      text: q.text,
      type: q.type,
      options: q.options || null,
      correct_answer: q.correct_answer,
    }));

    await this.questionRepository.createQuestions(questions);

    return this.quizRepository.findWithQuestions(quiz.id);
  }
}