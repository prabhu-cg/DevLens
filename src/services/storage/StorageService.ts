import type { Project } from '../../domain/project';

/**
 * Contract for local-first project persistence.
 * Phase 1A defines the shape only — the Dexie-backed implementation
 * (IndexedDB) lands in a later phase.
 */
export interface StorageService {
  listProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  saveProject(project: Project): Promise<void>;
  deleteProject(id: string): Promise<void>;
}
