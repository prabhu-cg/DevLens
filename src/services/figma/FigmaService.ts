import type { Project } from '../../domain/project';

/**
 * Contract for importing a Figma file into a local DevLens project.
 * Phase 1A defines the shape only — the real import/parsing pipeline
 * lands in a later phase. UI code must depend on this contract, not on
 * Figma's raw API response shapes.
 */
export interface FigmaImportSource {
  fileKey: string;
  personalAccessToken: string;
}

export interface FigmaService {
  importFile(source: FigmaImportSource): Promise<Project>;
}
