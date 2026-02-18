import { FastifyRequest, FastifyReply } from 'fastify';
import { QuizRepository } from '../../repositories/quiz.repository.interface';
import { SubmissionRepository } from '../../repositories/submission.repository.interface';
import { Not, IsNull } from 'typeorm';

const quizRepository = new QuizRepository();
const submissionRepository = new SubmissionRepository();

export async function getTeacherAnalytics(request: FastifyRequest, reply: FastifyReply) {
  try {
    const teacherId = request.user.id;

    // Buscar todos os quizzes do professor
    const quizzes = await quizRepository.repo.find({
      where: { teacher_id: teacherId },
    });

    // Para cada quiz, calcular estatísticas
    const stats = await Promise.all(
      quizzes.map(async (quiz) => {
        const submissions = await submissionRepository.repo.find({
          where: {
            quiz_id: quiz.id,
            completed_at: Not(IsNull()),
        },
        })

        const total = submissions.length
        let averageScore = 0
        if (total > 0) {
          const sum = submissions.reduce(
            (acc, s) => acc + Number(s.score || 0),
            0,
          )
          averageScore = sum / total
        }

        return {
          quizId: quiz.id,
          quizTitle: quiz.title,
          totalSubmissions: total,
          averageScore: Number(averageScore.toFixed(2)) || 0,
        };
      }),
    )

    return reply.send(stats);
  } catch (error) {
    console.error('Erro em getTeacherAnalytics:', error);
    return reply
      .status(500)
      .send({ message: 'Erro interno ao carregar analytics' })
  }
}