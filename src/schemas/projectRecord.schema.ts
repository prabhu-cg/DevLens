import { z } from 'zod';
import { PROJECT_SCHEMA_VERSION } from '../domain/project';

/**
 * Full schema for a persisted Project record — used to validate
 * IndexedDB reads/writes and, most importantly, imported
 * `*.devlens.json` files, which are untrusted input.
 */

export const pageRecordSchema = z.object({
  id: z.string().min(1),
  projectId: z.string().min(1),
  name: z.string().min(1),
  order: z.number(),
});

export const projectSettingsRecordSchema = z.object({
  autoSave: z.boolean(),
});

export const projectSourceSchema = z.enum(['blank', 'sample', 'import']);

export const docStatusSchema = z.enum(['not_started', 'in_progress', 'documented']);

export const openQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string(),
  status: z.enum(['open', 'answered']),
  answer: z.string().optional(),
});

export const interactionEntrySchema = z.object({
  id: z.string().min(1),
  trigger: z.enum(['click', 'hover', 'focus', 'drag', 'keypress', 'load']),
  description: z.string(),
});

export const responsiveNoteSchema = z.object({
  id: z.string().min(1),
  breakpoint: z.string(),
  description: z.string(),
});

export const componentPropertySchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  type: z.enum(['string', 'number', 'boolean', 'enum']),
  required: z.boolean(),
  description: z.string().optional(),
});

export const componentStateSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  description: z.string().optional(),
});

export const pageDocumentationSchema = z.object({
  pageId: z.string().min(1),
  status: docStatusSchema,
  overview: z.string(),
  purpose: z.string(),
  userGoal: z.string(),
  description: z.string(),
  layout: z.string(),
  responsive: z.array(responsiveNoteSchema),
  interactions: z.array(interactionEntrySchema),
  accessibility: z.array(z.string()),
  implementationNotes: z.string(),
  openQuestions: z.array(openQuestionSchema),
  updatedAt: z.string().min(1),
});

export const componentDocumentationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: docStatusSchema,
  overview: z.string(),
  purpose: z.string(),
  description: z.string(),
  anatomy: z.array(z.string()),
  variants: z.array(z.string()),
  properties: z.array(componentPropertySchema),
  states: z.array(componentStateSchema),
  usage: z.string(),
  behaviour: z.string(),
  responsive: z.array(responsiveNoteSchema),
  accessibility: z.array(z.string()),
  tokens: z.array(z.string()),
  implementationNotes: z.string(),
  openQuestions: z.array(openQuestionSchema),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const projectRecordSchema = z.object({
  schemaVersion: z.literal(PROJECT_SCHEMA_VERSION),
  id: z.string().min(1),
  name: z.string().trim().min(1).max(80),
  description: z.string().max(280).optional(),
  designer: z.string().max(80).optional(),
  version: z.string().min(1).max(20),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  source: projectSourceSchema,
  sourceFileId: z.string().optional(),
  sourceFileName: z.string().optional(),
  settings: projectSettingsRecordSchema,
  pages: z.array(pageRecordSchema),
  components: z.array(componentDocumentationSchema).default([]),
  pageDocs: z.array(pageDocumentationSchema).default([]),
  componentNames: z.array(z.string()).optional(),
});

export type ProjectRecord = z.infer<typeof projectRecordSchema>;
