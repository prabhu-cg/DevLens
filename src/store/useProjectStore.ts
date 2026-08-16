import { create } from 'zustand';
import type { Project } from '../domain/project';

interface ProjectStoreState {
  projects: Project[];
  addProject: (project: Project) => void;
  removeProject: (id: string) => void;
}

/**
 * In-memory project store for Phase 1A.
 * Persistence (Dexie/IndexedDB) is wired in a later phase.
 */
export const useProjectStore = create<ProjectStoreState>((set) => ({
  projects: [],
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  removeProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
    })),
}));
