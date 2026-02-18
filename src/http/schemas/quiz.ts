import { z } from 'zod';

const questionSchema = z.object({
  text: z.string().min(1),
  type: z.enum(['multiple_choice', 'true_false']),
  options: z.array(z.string()).optional(),
  correct_answer: z.union([z.string(), z.boolean(), z.number()]),
});

export const createQuizSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1),
});

export const quizIdParamSchema = z.object({
  id: z.coerce.number(),
});