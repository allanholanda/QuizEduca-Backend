import { SubmissionRepository } from '../../repositories/submission.repository.interface';
import { AnswerRepository } from '../../repositories/answer.repository.interface';
import { QuizRepository } from '../../repositories/quiz.repository.interface';
import { AppError } from '../../utils/error';

interface SubmitRequest {
  submissionId: number;
  studentId: number;
  answers: {
    questionId: number;
    selectedOption: any;
  }[];
  completedAt?: Date;
}

export class SubmitAnswersUseCase {
  constructor(
    private submissionRepository: SubmissionRepository,
    private answerRepository: AnswerRepository,
    private quizRepository: QuizRepository,
  ) {}

  async execute({ submissionId, studentId, answers, completedAt }: SubmitRequest) {
    const submission = await this.submissionRepository.findByIdWithAnswers(submissionId);
    if (!submission) {
      throw new AppError('Submission not found', 404);
    }
    if (submission.student_id !== studentId) {
      throw new AppError('Forbidden', 403);
    }
    if (submission.completed_at) {
      throw new AppError('Submission already completed', 400);
    }

    // Buscar quiz para obter as respostas corretas
    const quiz = await this.quizRepository.findWithQuestions(submission.quiz_id);
    if (!quiz) {
      throw new AppError('Quiz not found', 404);
    }

    // Mapear questões para fácil acesso
    const questionsMap = new Map(quiz.questions.map(q => [q.id, q]));

    // Calcular pontuação e criar respostas
    let correctCount = 0;
    const answerEntities = [];

    for (const ans of answers) {
      const question = questionsMap.get(ans.questionId);
      if (!question) {
        throw new AppError(`Question ${ans.questionId} not found in this quiz`, 400);
      }

      const isCorrect = JSON.stringify(question.correct_answer) === JSON.stringify(ans.selectedOption);
      if (isCorrect) correctCount++;

      answerEntities.push({
        submission_id: submissionId,
        question_id: ans.questionId,
        selected_option: ans.selectedOption,
        is_correct: isCorrect,
      });
    }

    // Salvar respostas
    await this.answerRepository.createAnswers(answerEntities);

    // Calcular score percentual
    const score = (correctCount / quiz.questions.length) * 100;

    // Atualizar submissão
    await this.submissionRepository.updateSubmission(submissionId, {
      completed_at: completedAt || new Date(),
      score,
    });

    return { submissionId, score, totalQuestions: quiz.questions.length, correctCount };
  }
}