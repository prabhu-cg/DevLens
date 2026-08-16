export type { StorageService } from './StorageService';
export { db, ProjectDatabase } from './db';
export type { AppSettingsRecord } from './db';
export {
  listProjects,
  getProject,
  createProject,
  updateProject,
  renameProject,
  duplicateProject,
  deleteProject,
  addPage,
  addComponent,
  updatePageDocumentation,
  updateComponentDocumentation,
  createEmptyPageDoc,
  createEmptyComponentDoc,
  serializeProject,
  importProjectFromJson,
  InvalidProjectFileError,
  seedSampleProject,
  getAppSettings,
  setLastOpenedProject,
} from './projectStorage';
export type { CreateProjectInput, ImportProjectResult } from './projectStorage';
