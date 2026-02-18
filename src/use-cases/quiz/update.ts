import { QuizRepository } from '../../repositories/quiz.repository.interface';
import { AppError } from '../../utils/error';
import { Question } from '../../entities/question.entity';

interface UpdateQuizRequest {
  id: number;
  teacherId: number;
  title: string;
  description?: string;
  questions: {
    text: string;
    type: 'multiple_choice' | 'true_false';
    options?: string[];
    correct_answer: any;
  }[];
}

export class UpdateQuizUseCase {
  constructor(
    private quizRepository: QuizRepository,
    private questionRepository: QuestionRepository,
  ) {}

  async execute({ id, teacherId, title, description, questions }: UpdateQuizRequest) {
    // 1. Verificar se o quiz existe e pertence ao professor
    const quiz = await this.quizRepository.findWithQuestions(id);
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }
    if (quiz.teacher_id !== teacherId) {
      throw new AppError('Forbidden', 403);
    }

    // 2. Validar estrutura das perguntas
    for (const q of questions) {
      if (q.type === 'multiple_choice' && (!q.options || q.options.length < 2)) {
        throw new AppError('Multiple choice questions must have at least 2 options');
      }
      if (q.type === 'true_false' && ![true, false].includes(q.correct_answer)) {
        throw new AppError('True/false correct answer must be true or false');
      }
    }

    // 3. Remover perguntas antigas (se houver)
    if (quiz.questions && quiz.questions.length > 0) {
      await this.questionRepository.repo.remove(quiz.questions);
    }

    // 4. Atualizar dados básicos do quiz
    quiz.title = title;
    quiz.description = description || null;

    // 5. Criar novas perguntas (associadas ao quiz)
    quiz.questions = questions.map((q) => {
      const question = new Question();
      question.text = q.text;
      question.type = q.type;
      question.options = q.options || null;
      question.correct_answer = q.correct_answer;
      return question;
    });

    // 6. Salvar o quiz (cascade insere as novas perguntas)
    await this.quizRepository.repo.save(quiz);

    // 7. Retornar o quiz atualizado com as novas perguntas
    return this.quizRepository.findWithQuestions(quiz.id);
  }
}