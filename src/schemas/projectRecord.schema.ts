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
  componentNames: z.array(z.string()),
});

export type ProjectRecord = z.infer<typeof projectRecordSchema>;
