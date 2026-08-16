import type { Project } from '../../domain/project';

/**
 * Contract for generating developer-facing documentation exports.
 * Phase 1A defines the shape only — export generation lands in a later
 * phase.
 */
export type ExportFormat = 'markdown' | 'html' | 'json';

export interface ExportResult {
  format: ExportFormat;
  filename: string;
  content: string;
}

export interface ExportService {
  exportProject(project: Project, format: ExportFormat): Promise<ExportResult>;
}
