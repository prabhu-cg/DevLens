import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../src/services/storage/db';
import {
  createProject,
  deleteProject,
  duplicateProject,
  getProject,
  importProjectFromJson,
  InvalidProjectFileError,
  listProjects,
  renameProject,
  seedSampleProject,
  serializeProject,
  updateProject,
} from '../../src/services/storage/projectStorage';

beforeEach(async () => {
  await db.projects.clear();
  await db.projectVersions.clear();
  await db.settings.clear();
});

describe('project storage', () => {
  it('creates and lists a project', async () => {
    const project = await createProject({ name: 'Checkout redesign' });

    expect(project.id).toBeTruthy();
    expect(project.schemaVersion).toBe('1.0');
    expect(project.version).toBe('1.0');
    expect(project.source).toBe('blank');

    const projects = await listProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0]!.name).toBe('Checkout redesign');
  });

  it('survives being re-read as if the browser restarted', async () => {
    const created = await createProject({ name: 'Persisted project' });

    const reloaded = await getProject(created.id);

    expect(reloaded).toEqual(created);
  });

  it('renames a project and updates its timestamp', async () => {
    const created = await createProject({ name: 'Old name' });
    const renamed = await renameProject(created.id, 'New name');

    expect(renamed.name).toBe('New name');
    expect(renamed.updatedAt >= created.updatedAt).toBe(true);
  });

  it('duplicates a project with a new id and copied pages', async () => {
    const created = await createProject({ name: 'Original' });
    await updateProject({
      ...created,
      pages: [{ id: 'page-1', projectId: created.id, name: 'Home', order: 0 }],
    });

    const duplicate = await duplicateProject(created.id);

    expect(duplicate.id).not.toBe(created.id);
    expect(duplicate.name).toBe('Original copy');
    expect(duplicate.pages).toHaveLength(1);
    expect(duplicate.pages[0]!.id).not.toBe('page-1');
    expect(duplicate.pages[0]!.projectId).toBe(duplicate.id);

    const projects = await listProjects();
    expect(projects).toHaveLength(2);
  });

  it('deletes a project', async () => {
    const created = await createProject({ name: 'To delete' });
    await deleteProject(created.id);

    expect(await getProject(created.id)).toBeUndefined();
    expect(await listProjects()).toHaveLength(0);
  });

  it('records a version snapshot when the version field changes', async () => {
    const created = await createProject({ name: 'Versioned', version: '1.0' });
    await updateProject({ ...created, version: '2.0' });

    const snapshots = await db.projectVersions.where('projectId').equals(created.id).toArray();
    expect(snapshots).toHaveLength(2); // one on create, one on the 1.0 -> 2.0 change
    expect(snapshots.some((snapshot) => snapshot.version === '1.0')).toBe(true);
  });

  it('seeds the FinEdge sample project with pages and components', async () => {
    const sample = await seedSampleProject();

    expect(sample.name).toBe('FinEdge Banking Dashboard');
    expect(sample.source).toBe('sample');
    expect(sample.pages).toHaveLength(5);
    expect(sample.componentNames).toContain('Button');
    expect(sample.componentNames).toHaveLength(9);
  });

  it('imports a valid exported project as a new record', async () => {
    const original = await createProject({ name: 'Exportable', description: 'Has data' });
    const json = serializeProject(original);

    const { project: imported } = await importProjectFromJson(json);

    expect(imported.id).not.toBe(original.id);
    expect(imported.name).toBe('Exportable');
    expect(imported.source).toBe('import');

    expect(await listProjects()).toHaveLength(2);
  });

  it('rejects malformed JSON without touching storage', async () => {
    await expect(importProjectFromJson('not json at all')).rejects.toBeInstanceOf(
      InvalidProjectFileError,
    );
    expect(await listProjects()).toHaveLength(0);
  });

  it('rejects well-formed JSON that does not match the project schema', async () => {
    await expect(importProjectFromJson(JSON.stringify({ hello: 'world' }))).rejects.toBeInstanceOf(
      InvalidProjectFileError,
    );
    expect(await listProjects()).toHaveLength(0);
  });
});
