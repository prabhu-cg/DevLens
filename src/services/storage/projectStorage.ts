import type { Project, ProjectSettings, Page } from '../../domain/project';
import { PROJECT_SCHEMA_VERSION } from '../../domain/project';
import type { ComponentDocumentation, PageDocumentation } from '../../domain/documentation';
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

export function createEmptyPageDoc(pageId: string): PageDocumentation {
  return {
    pageId,
    status: 'not_started',
    overview: '',
    purpose: '',
    userGoal: '',
    description: '',
    layout: '',
    responsive: [],
    interactions: [],
    accessibility: [],
    implementationNotes: '',
    openQuestions: [],
    updatedAt: new Date().toISOString(),
  };
}

export function createEmptyComponentDoc(name: string, id = generateId()): ComponentDocumentation {
  const now = new Date().toISOString();
  return {
    id,
    name,
    status: 'not_started',
    overview: '',
    purpose: '',
    description: '',
    anatomy: [],
    variants: [],
    properties: [],
    states: [],
    usage: '',
    behaviour: '',
    responsive: [],
    accessibility: [],
    tokens: [],
    implementationNotes: '',
    openQuestions: [],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Fills in fields that may be missing from projects persisted or exported
 * by an earlier phase, so old data keeps working without a hard migration.
 */
function normalizeProject(project: Project): Project {
  const components =
    project.components && project.components.length > 0
      ? project.components
      : (project.componentNames ?? []).map((name) => createEmptyComponentDoc(name));

  const pageDocs = project.pages.map(
    (page) =>
      project.pageDocs?.find((doc) => doc.pageId === page.id) ?? createEmptyPageDoc(page.id),
  );

  return { ...project, components, pageDocs };
}

export async function listProjects(): Promise<Project[]> {
  const projects = await db.projects.toArray();
  return projects.map(normalizeProject).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getProject(id: string): Promise<Project | undefined> {
  const project = await db.projects.get(id);
  return project ? normalizeProject(project) : undefined;
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
    components: [],
    pageDocs: [],
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
  const existing = await getProject(id);
  if (!existing) {
    throw new Error(`Project ${id} not found`);
  }
  return updateProject({ ...existing, name });
}

export async function duplicateProject(id: string): Promise<Project> {
  const existing = await getProject(id);
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
  // pageDocs reference pages by id, so they must be remapped alongside them.
  duplicate.pageDocs = existing.pages.map((page, index) => {
    const doc = existing.pageDocs.find((d) => d.pageId === page.id);
    const newPageId = duplicate.pages[index]!.id;
    return doc ? { ...doc, pageId: newPageId } : createEmptyPageDoc(newPageId);
  });
  duplicate.components = existing.components.map((component) => ({
    ...component,
    id: generateId(),
  }));

  await db.projects.add(duplicate);
  await recordVersionSnapshot(duplicate);
  return duplicate;
}

export async function deleteProject(id: string): Promise<void> {
  await db.projects.delete(id);
  await db.projectVersions.where('projectId').equals(id).delete();
}

export async function addPage(projectId: string, name: string): Promise<Project> {
  const project = await getProject(projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  const page: Page = {
    id: generateId(),
    projectId,
    name,
    order: project.pages.length,
  };

  return updateProject({
    ...project,
    pages: [...project.pages, page],
    pageDocs: [...project.pageDocs, createEmptyPageDoc(page.id)],
  });
}

export async function addComponent(projectId: string, name: string): Promise<Project> {
  const project = await getProject(projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  return updateProject({
    ...project,
    components: [...project.components, createEmptyComponentDoc(name)],
  });
}

export async function updatePageDocumentation(
  projectId: string,
  pageId: string,
  patch: Partial<PageDocumentation>,
): Promise<Project> {
  const project = await getProject(projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  const pageDocs = project.pageDocs.map((doc) =>
    doc.pageId === pageId ? { ...doc, ...patch, updatedAt: new Date().toISOString() } : doc,
  );

  return updateProject({ ...project, pageDocs });
}

export async function updateComponentDocumentation(
  projectId: string,
  componentId: string,
  patch: Partial<ComponentDocumentation>,
): Promise<Project> {
  const project = await getProject(projectId);
  if (!project) {
    throw new Error(`Project ${projectId} not found`);
  }

  const components = project.components.map((component) =>
    component.id === componentId
      ? { ...component, ...patch, updatedAt: new Date().toISOString() }
      : component,
  );

  return updateProject({ ...project, components });
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
  const pageIdMap = new Map(result.data.pages.map((page) => [page.id, generateId()]));

  const project: Project = normalizeProject({
    ...result.data,
    id: newId,
    source: 'import',
    createdAt: now,
    updatedAt: now,
    pages: result.data.pages.map((page) => ({
      ...page,
      id: pageIdMap.get(page.id)!,
      projectId: newId,
    })),
    pageDocs: result.data.pageDocs.map((doc) => ({
      ...doc,
      pageId: pageIdMap.get(doc.pageId) ?? doc.pageId,
    })),
    components: result.data.components.map((component) => ({
      ...component,
      id: generateId(),
    })),
  });

  await db.projects.add(project);
  await recordVersionSnapshot(project);
  return { project };
}

const SAMPLE_PAGE_NAMES = [
  'Dashboard',
  'Transactions',
  'Transaction Details',
  'Account Details',
  'Settings',
];

const SAMPLE_COMPONENT_NAMES = [
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

function sampleDashboardDoc(pageId: string): PageDocumentation {
  return {
    pageId,
    status: 'documented',
    overview:
      'The landing page after login. Surfaces account balances, recent activity, and quick actions.',
    purpose: 'Give the user an at-a-glance summary of their financial position.',
    userGoal: 'Quickly check balances and jump into a specific account or transaction.',
    description:
      'A grid of balance cards followed by a condensed list of recent transactions across all accounts.',
    layout:
      'Two-column on desktop: balance cards in a row at the top, recent activity list below spanning full width.',
    responsive: [
      {
        id: generateId(),
        breakpoint: 'Mobile',
        description: 'Balance cards stack vertically and become swipeable.',
      },
      {
        id: generateId(),
        breakpoint: 'Tablet',
        description: 'Balance cards wrap to two per row.',
      },
    ],
    interactions: [
      {
        id: generateId(),
        trigger: 'click',
        description: 'Tapping a balance card navigates to that account’s details page.',
      },
      {
        id: generateId(),
        trigger: 'hover',
        description: 'Recent activity rows highlight on hover to indicate they are clickable.',
      },
    ],
    accessibility: [
      'Balance changes are announced via an aria-live polite region.',
      'All balance cards are reachable and operable via keyboard.',
    ],
    implementationNotes:
      'Fetch balance figures independently per account so one slow account does not block the rest of the page.',
    openQuestions: [
      {
        id: generateId(),
        question: 'Should the recent activity list be paginated or infinite scroll?',
        status: 'open',
      },
    ],
    updatedAt: new Date().toISOString(),
  };
}

function sampleButtonDoc(id: string): ComponentDocumentation {
  const now = new Date().toISOString();
  return {
    id,
    name: 'Button',
    status: 'documented',
    overview: 'The primary interactive control used across forms and actions.',
    purpose: 'Primary action for submitting or confirming an action.',
    description:
      'A single button element supporting multiple visual variants and interactive states.',
    anatomy: ['Label', 'Optional leading icon', 'Optional trailing icon'],
    variants: ['Primary', 'Secondary', 'Destructive'],
    properties: [
      {
        id: generateId(),
        name: 'variant',
        type: 'enum',
        required: false,
        description: 'Visual style of the button.',
      },
      {
        id: generateId(),
        name: 'disabled',
        type: 'boolean',
        required: false,
        description: 'Prevents interaction when true.',
      },
      {
        id: generateId(),
        name: 'isLoading',
        type: 'boolean',
        required: false,
        description: 'Shows a spinner and disables interaction.',
      },
    ],
    states: [
      { id: generateId(), name: 'Default' },
      { id: generateId(), name: 'Hover' },
      { id: generateId(), name: 'Focus' },
      { id: generateId(), name: 'Disabled' },
      {
        id: generateId(),
        name: 'Loading',
        description: 'Shows a spinner and disables interaction to prevent duplicate submission.',
      },
    ],
    usage:
      'Use for the single primary action on a screen. Avoid more than one primary button per view.',
    behaviour:
      'Loading state prevents duplicate submission by disabling the control until the action resolves.',
    responsive: [],
    accessibility: [
      'Keyboard accessible via Tab and activated with Enter or Space.',
      'Visible focus ring required.',
    ],
    tokens: ['action.primary', 'text.on-primary', 'radius.medium'],
    implementationNotes:
      'Disabled and loading states must both set aria-disabled, not just the disabled attribute, so screen readers announce the change.',
    openQuestions: [],
    createdAt: now,
    updatedAt: now,
  };
}

export async function seedSampleProject(): Promise<Project> {
  const now = new Date().toISOString();
  const id = generateId();

  const pages: Page[] = SAMPLE_PAGE_NAMES.map((name, index) => ({
    id: generateId(),
    projectId: id,
    name,
    order: index,
  }));

  const pageDocs: PageDocumentation[] = pages.map((page) =>
    page.name === 'Dashboard' ? sampleDashboardDoc(page.id) : createEmptyPageDoc(page.id),
  );

  const components: ComponentDocumentation[] = SAMPLE_COMPONENT_NAMES.map((name) => {
    const componentId = generateId();
    return name === 'Button'
      ? sampleButtonDoc(componentId)
      : createEmptyComponentDoc(name, componentId);
  });

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
    pages,
    pageDocs,
    components,
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
