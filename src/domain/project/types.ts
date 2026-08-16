/**
 * Core project and page entities.
 * A Project is the top-level local container for an imported design and
 * everything derived from it. Interfaces only — no behavior yet.
 */

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  pages: Page[];
  sourceFileKey?: string;
}

export interface Page {
  id: string;
  projectId: string;
  name: string;
  order: number;
}
