/**
 * Core project and page entities.
 * A Project is the top-level local container for an imported design and
 * everything derived from it, persisted locally via IndexedDB.
 */

import type { ComponentDocumentation, PageDocumentation } from '../documentation';

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
  /** Structured, editable documentation for each component in this project. */
  components: ComponentDocumentation[];
  /** Structured, editable documentation for each page, keyed by page id. */
  pageDocs: PageDocumentation[];
  /**
   * @deprecated superseded by `components`. Kept optional so older
   * exported/persisted projects still load; normalized away on read.
   */
  componentNames?: string[];
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
