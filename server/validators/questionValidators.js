import { z } from 'zod';

const optionSchema = z.object({ text: z.string().min(1) });

const baseQuestion = {
  type: z.enum(['mcq', 'true_false', 'short_answer', 'long_answer', 'coding']).optional(),
  question: z.string().min(1),
  options: z.array(optionSchema).optional(),
  correctAnswer: z.number().int().nullable().optional(),
  marks: z.number().min(0).optional(),
  negativeMarks: z.number().min(0).optional(),
  explanation: z.string().optional(),
};

export const createQuestionSchema = { body: z.object(baseQuestion) };
export const bulkQuestionsSchema = { body: z.object({ questions: z.array(z.object(baseQuestion)).min(1) }) };
export const updateQuestionSchema = { body: z.object(baseQuestion).partial() };
