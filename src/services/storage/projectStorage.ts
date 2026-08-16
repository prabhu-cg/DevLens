import type { Project, ProjectSettings } from '../../domain/project';
import { PROJECT_SCHEMA_VERSION } from '../../domain/project';
import { projectRecordSchema } from '../../schemas/projectRecord.schema';
import { generateId } from '../../utils/id';
import { db } from './db';

const DEFAULT_SETTINGS: ProjectSettings = { autoSave: true };

export interface CreateProjectInput {
  name: string;
  description?: string;
  designer?: string;
  version?: string;
}

export async function listProjects(): Promise<Project[]> {
  const projects = await db.projects.toArray();
  return projects.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProject(id: string): Promise<Project | undefined> {
  return db.projects.get(id);
}

async function recordVersionSnapshot(project: Project): Promise<void> {
  await db.projectVersions.add({
    id: generateId(),
    projectId: project.id,
    version: project.version,
    snapshot: project,
    createdAt: new Date().toISOString(),
  });
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const now = new Date().toISOString();
  const project: Project = {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: generateId(),
    name: input.name,
    description: input.description,
    designer: input.designer,
    version: input.version?.trim() || '1.0',
    createdAt: now,
    updatedAt: now,
    source: 'blank',
    settings: DEFAULT_SETTINGS,
    pages: [],
    componentNames: [],
  };

  await db.projects.add(project);
  await recordVersionSnapshot(project);
  return project;
}

export async function updateProject(project: Project): Promise<Project> {
  const existing = await db.projects.get(project.id);
  const updated: Project = { ...project, updatedAt: new Date().toISOString() };

  if (existing && existing.version !== updated.version) {
    await recordVersionSnapshot(existing);
  }

  await db.projects.put(updated);
  return updated;
}

export async function renameProject(id: string, name: string): Promise<Project> {
  const existing = await db.projects.get(id);
  if (!existing) {
    throw new Error(`Project ${id} not found`);
  }
  return updateProject({ ...existing, name });
}

export async function duplicateProject(id: string): Promise<Project> {
  const existing = await db.projects.get(id);
  if (!existing) {
    throw new Error(`Project ${id} not found`);
  }

  const now = new Date().toISOString();
  const newId = generateId();
  const duplicate: Project = {
    ...existing,
    id: newId,
    name: `${existing.name} copy`,
    createdAt: now,
    updatedAt: now,
    pages: existing.pages.map((page) => ({ ...page, id: generateId(), projectId: newId })),
  };

  await db.projects.add(duplicate);
  await recordVersionSnapshot(duplicate);
  return duplicate;
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id);
  await db.projectVersions.where('projectId').equals(id).delete();
}

export function serializeProject(project: Project): string {
  return JSON.stringify(project, null, 2);
}

export interface ImportProjectResult {
  project: Project;
}

export class InvalidProjectFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidProjectFileError';
  }
}

export async function importProjectFromJson(jsonText: string): Promise<ImportProjectResult> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new InvalidProjectFileError('That file is not valid JSON.');
  }

  const result = projectRecordSchema.safeParse(parsed);
  if (!result.success) {
    throw new InvalidProjectFileError('That file does not match the DevLens project format.');
  }

  const now = new Date().toISOString();
  const newId = generateId();
  const project: Project = {
    ...result.data,
    id: newId,
    source: 'import',
    createdAt: now,
    updatedAt: now,
    pages: result.data.pages.map((page) => ({ ...page, id: generateId(), projectId: newId })),
  };

  await db.projects.add(project);
  await recordVersionSnapshot(project);
  return { project };
}

const SAMPLE_PAGES = [
  'Dashboard',
  'Transactions',
  'Transaction Details',
  'Account Details',
  'Settings',
];

const SAMPLE_COMPONENTS = [
  'Button',
  'Input',
  'Select',
  'Card',
  'Table',
  'Modal',
  'Tabs',
  'Toast',
  'Pagination',
];

export async function seedSampleProject(): Promise<Project> {
  const now = new Date().toISOString();
  const id = generateId();

  const project: Project = {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id,
    name: 'FinEdge Banking Dashboard',
    description: 'A fictional banking dashboard used to demonstrate a complete DevLens handoff.',
    designer: 'DevLens sample data',
    version: '1.0',
    createdAt: now,
    updatedAt: now,
    source: 'sample',
    settings: DEFAULT_SETTINGS,
    pages: SAMPLE_PAGES.map((name, index) => ({
      id: generateId(),
      projectId: id,
      name,
      order: index,
    })),
    componentNames: SAMPLE_COMPONENTS,
  };

  await db.projects.add(project);
  await recordVersionSnapshot(project);
  return project;
}

export async function getAppSettings() {
  const existing = await db.settings.get('app');
  if (existing) return existing;

  const defaults = { id: 'app' as const, theme: 'light' as const };
  await db.settings.put(defaults);
  return defaults;
}

export async function setLastOpenedProject(projectId: string): Promise<void> {
  const settings = await getAppSettings();
  await db.settings.put({ ...settings, lastOpenedProjectId: projectId });
}
