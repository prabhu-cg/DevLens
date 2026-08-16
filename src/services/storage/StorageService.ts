import type { Project } from '../../domain/project';

/**
 * Contract for local-first project persistence, backed by IndexedDB via
 * Dexie. See `projectStorage.ts` for the concrete implementation — it is
 * exported as plain functions rather than a class, but fulfils this shape.
 */
export interface StorageService {
  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(input: {
    name: string;
    description?: string;
    designer?: string;
    version?: string;
  }): Promise<Project>;
  updateProject(project: Project): Promise<Project>;
  renameProject(id: string, name: string): Promise<Project>;
  duplicateProject(id: string): Promise<Project>;
  deleteProject(id: string): Promise<void>;
}
