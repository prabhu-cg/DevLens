import Dexie, { type Table } from 'dexie';
import type { Project, ProjectVersionRecord } from '../../domain/project';

export interface AppSettingsRecord {
  /** Singleton row id — there is only ever one settings record. */
  id: 'app';
  theme: 'light' | 'dark';
  lastOpenedProjectId?: string;
}

/**
 * DevLens' local-first project database.
 * Tables: projects, projectVersions, settings — nothing else. Pages and
 * component names live inline on the project record rather than as
 * separate tables, since they don't yet need independent querying.
 */
export class ProjectDatabase extends Dexie {
  projects!: Table<Project, string>;
  projectVersions!: Table<ProjectVersionRecord, string>;
  settings!: Table<AppSettingsRecord, string>;

  constructor() {
    super('devlens');
    this.version(1).stores({
      projects: 'id, name, updatedAt',
      projectVersions: 'id, projectId, createdAt',
      settings: 'id',
    });
  }
}

export const db = new ProjectDatabase();
