import { z } from 'zod';

export const startSubmissionSchema = z.object({
  quizId: z.number(),
});

export const answerSchema = z.object({
  questionId: z.number(),
  selectedOption: z.any(),
});

export const submitAnswersSchema = z.object({
  answers: z.array(answerSchema),
  completedAt: z.string().datetime().optional(),
});

export const syncSubmissionsSchema = z.object({
  submissions: z.array(
    z.object({
      quizId: z.number(),
      startedAt: z.string().datetime().optional(),
      completedAt: z.string().datetime().optional(),
      answers: z.array(answerSchema),
    })
  ),
});