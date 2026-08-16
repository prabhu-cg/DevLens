/**
 * Core project and page entities.
 * A Project is the top-level local container for an imported design and
 * everything derived from it, persisted locally via IndexedDB.
 */

export const PROJECT_SCHEMA_VERSION = '1.0';

export type ProjectSource = 'blank' | 'sample' | 'import';

export interface ProjectSettings {
  /** Whether edits to this project are saved automatically as the user types. */
  autoSave: boolean;
}

export interface Project {
  schemaVersion: typeof PROJECT_SCHEMA_VERSION;
  id: string;
  name: string;
  description?: string;
  designer?: string;
  version: string;
  createdAt: string;
  updatedAt: string;
  source: ProjectSource;
  sourceFileId?: string;
  sourceFileName?: string;
  settings: ProjectSettings;
  pages: Page[];
  /**
   * Names of components identified for this project. A lightweight
   * placeholder until the documentation engine (a later phase) produces
   * full DesignComponent records.
   */
  componentNames: string[];
}

export interface Page {
  id: string;
  projectId: string;
  name: string;
  order: number;
}

/** A snapshot of a project taken when its version number changes. */
export interface ProjectVersionRecord {
  id: string;
  projectId: string;
  version: string;
  snapshot: Project;
  createdAt: string;
}
