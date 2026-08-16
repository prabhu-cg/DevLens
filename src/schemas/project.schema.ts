import { z } from 'zod';

export const newProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Project name is required')
    .max(80, 'Project name must be 80 characters or fewer'),
  description: z.string().trim().max(280, 'Description must be 280 characters or fewer').optional(),
  designer: z.string().trim().max(80, 'Designer must be 80 characters or fewer').optional(),
  version: z.string().trim().max(20, 'Version must be 20 characters or fewer').optional(),
});

export type NewProjectFormValues = z.infer<typeof newProjectSchema>;

export const projectDetailsSchema = z.object({
  description: z.string().trim().max(280, 'Description must be 280 characters or fewer').optional(),
  designer: z.string().trim().max(80, 'Designer must be 80 characters or fewer').optional(),
  version: z
    .string()
    .trim()
    .min(1, 'Version is required')
    .max(20, 'Version must be 20 characters or fewer'),
});

export type ProjectDetailsFormValues = z.infer<typeof projectDetailsSchema>;
