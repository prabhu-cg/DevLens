import { create } from 'zustand';
import type { Project } from '../domain/project';
import {
  createProject as createProjectRecord,
  deleteProject as deleteProjectRecord,
  duplicateProject as duplicateProjectRecord,
  importProjectFromJson,
  listProjects,
  renameProject as renameProjectRecord,
  seedSampleProject,
  updateProject as updateProjectRecord,
} from '../services/storage';
import type { CreateProjectInput } from '../services/storage';

export type ProjectStoreStatus = 'idle' | 'loading' | 'ready' | 'error';

interface ProjectStoreState {
  projects: Project[];
  status: ProjectStoreStatus;
  error?: string;
  loadProjects: () => Promise<void>;
  createProject: (input: CreateProjectInput) => Promise<Project>;
  renameProject: (id: string, name: string) => Promise<Project>;
  duplicateProject: (id: string) => Promise<Project>;
  deleteProject: (id: string) => Promise<void>;
  updateProject: (project: Project) => Promise<Project>;
  importProject: (jsonText: string) => Promise<Project>;
  createSampleProject: () => Promise<Project>;
}

function upsert(projects: Project[], project: Project): Project[] {
  const index = projects.findIndex((candidate) => candidate.id === project.id);
  if (index === -1) return [project, ...projects];
  const next = [...projects];
  next[index] = project;
  return next;
}

export const useProjectStore = create<ProjectStoreState>((set) => ({
  projects: [],
  status: 'idle',

  loadProjects: async () => {
    set({ status: 'loading' });
    try {
      const projects = await listProjects();
      set({ projects, status: 'ready' });
    } catch {
      set({ status: 'error', error: 'Could not load projects from this browser.' });
    }
  },

  createProject: async (input) => {
    const project = await createProjectRecord(input);
    set((state) => ({ projects: upsert(state.projects, project) }));
    return project;
  },

  renameProject: async (id, name) => {
    const project = await renameProjectRecord(id, name);
    set((state) => ({ projects: upsert(state.projects, project) }));
    return project;
  },

  duplicateProject: async (id) => {
    const project = await duplicateProjectRecord(id);
    set((state) => ({ projects: upsert(state.projects, project) }));
    return project;
  },

  deleteProject: async (id) => {
    await deleteProjectRecord(id);
    set((state) => ({ projects: state.projects.filter((project) => project.id !== id) }));
  },

  updateProject: async (project) => {
    const updated = await updateProjectRecord(project);
    set((state) => ({ projects: upsert(state.projects, updated) }));
    return updated;
  },

  importProject: async (jsonText) => {
    const { project } = await importProjectFromJson(jsonText);
    set((state) => ({ projects: upsert(state.projects, project) }));
    return project;
  },

  createSampleProject: async () => {
    const project = await seedSampleProject();
    set((state) => ({ projects: upsert(state.projects, project) }));
    return project;
  },
}));

export function useProject(id: string | undefined): Project | undefined {
  return useProjectStore((state) => state.projects.find((project) => project.id === id));
}

/** Exposed for tests that need to await store hydration outside a component. */
export function getProjectStoreState() {
  return useProjectStore.getState();
}
