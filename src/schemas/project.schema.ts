import { z } from 'zod';

export const newProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Project name is required')
    .max(80, 'Project name must be 80 characters or fewer'),
  description: z.string().trim().max(280, 'Description must be 280 characters or fewer').optional(),
});

export type NewProjectFormValues = z.infer<typeof newProjectSchema>;
