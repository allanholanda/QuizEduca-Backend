import { SubmissionRepository } from '../../repositories/submission.repository.interface';
import { QuizRepository } from '../../repositories/quiz.repository.interface';
import { AnswerRepository } from '../../repositories/answer.repository.interface';
import { AppError } from '../../utils/error';

interface SyncSubmission {
  quizId: number;
  startedAt?: Date;
  completedAt?: Date;
  answers: {
    questionId: number;
    selectedOption: any;
  }[];
}

interface SyncRequest {
  studentId: number;
  submissions: SyncSubmission[];
}

export class SyncSubmissionsUseCase {
  constructor(
    private submissionRepository: SubmissionRepository,
    private quizRepository: QuizRepository,
    private answerRepository: AnswerRepository,
  ) {}

  async execute({ studentId, submissions }: SyncRequest) {
    const results = [];

    for (const sub of submissions) {
      // Verificar se já existe submissão para este quiz (pode ser atualização)
      let existing = await this.submissionRepository.findByStudentAndQuiz(studentId, sub.quizId);

      if (existing && existing.completed_at) {
        // Já finalizada, ignorar ou lançar erro? Vamos ignorar e retornar info
        results.push({ quizId: sub.quizId, status: 'already_completed', submissionId: existing.id });
        continue;
      }

      const quiz = await this.quizRepository.findWithQuestions(sub.quizId);
      if (!quiz) {
        results.push({ quizId: sub.quizId, status: 'quiz_not_found' });
        continue;
      }

      // Se não existe, criar nova
      if (!existing) {
        existing = await this.submissionRepository.createSubmission({
          student_id: studentId,
          quiz_id: sub.quizId,
          started_at: sub.startedAt || new Date(),
        });
      }

      // Mapear questões
      const questionsMap = new Map(quiz.questions.map(q => [q.id, q]));

      // Calcular pontuação
      let correctCount = 0;
      const answerEntities = [];

      for (const ans of sub.answers) {
        const question = questionsMap.get(ans.questionId);
        if (!question) continue; // ignorar questão inválida

        const isCorrect = JSON.stringify(question.correct_answer) === JSON.stringify(ans.selectedOption);
        if (isCorrect) correctCount++;

        answerEntities.push({
          submission_id: existing.id,
          question_id: ans.questionId,
          selected_option: ans.selectedOption,
          is_correct: isCorrect,
        });
      }

      // Salvar respostas
      await this.answerRepository.createAnswers(answerEntities);

      const score = (correctCount / quiz.questions.length) * 100;

      await this.submissionRepository.updateSubmission(existing.id, {
        completed_at: sub.completedAt || new Date(),
        score,
      });

      results.push({
        quizId: sub.quizId,
        status: 'synced',
        submissionId: existing.id,
        score,
      });
    }

    return results;
  }
}