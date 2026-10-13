import { z } from 'zod';

export const saveAnswerSchema = {
  body: z.object({
    questionId: z.string().min(1),
    selectedOption: z.number().int().nullable().optional(),
    textAnswer: z.string().optional(),
  }),
};

export const submitSchema = {
  body: z.object({ auto: z.boolean().optional() }).optional(),
};

export const recordViolationSchema = {
  body: z.object({
    attemptId: z.string().min(1),
    type: z.string().min(2),
    description: z.string().optional(),
    metadata: z.record(z.any()).optional(),
  }),
};
