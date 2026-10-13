import { z } from 'zod';

const settingsSchema = z.object({
  shuffleQuestions: z.boolean().optional(),
  shuffleOptions: z.boolean().optional(),
  negativeMarking: z.boolean().optional(),
  negativeMarkValue: z.number().min(0).optional(),
  faceDetection: z.boolean().optional(),
  multipleFaces: z.boolean().optional(),
  tabSwitch: z.boolean().optional(),
  phoneDetection: z.boolean().optional(),
  noiseDetection: z.boolean().optional(),
  screenMonitoring: z.boolean().optional(),
  copyPaste: z.boolean().optional(),
  suspiciousMovement: z.boolean().optional(),
  requireFaceVerification: z.boolean().optional(),
  verificationInterval: z.number().min(5).max(600).optional(),
  monitoringInterval: z.number().min(5).max(600).optional(),
  allowMultipleAttempts: z.boolean().optional(),
}).partial();

export const createExamSchema = {
  body: z.object({
    title: z.string().min(3).max(200),
    description: z.string().max(2000).optional(),
    subject: z.string().max(120).optional(),
    instructions: z.string().max(5000).optional(),
    duration: z.number().int().positive(),
    passingMarks: z.number().min(0).optional(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    status: z.enum(['draft', 'scheduled']).optional(),
    settings: settingsSchema.optional(),
  }),
};

export const updateExamSchema = {
  body: createExamSchema.body.partial(),
};

export const assignStudentsSchema = {
  body: z.object({ studentIds: z.array(z.string()).default([]) }),
};
