import { beforeEach, describe, expect, it } from 'vitest';
import { db } from '../../src/services/storage/db';
import {
  addComponent,
  addPage,
  createProject,
  getProject,
  updateComponentDocumentation,
  updatePageDocumentation,
} from '../../src/services/storage/projectStorage';

beforeEach(async () => {
  await db.projects.clear();
  await db.projectVersions.clear();
  await db.settings.clear();
});

describe('documentation storage', () => {
  it('adds a page with a paired empty documentation record', async () => {
    const project = await createProject({ name: 'Doc test' });
    const updated = await addPage(project.id, 'Checkout');

    expect(updated.pages).toHaveLength(1);
    const page = updated.pages[0]!;
    expect(page.name).toBe('Checkout');

    const doc = updated.pageDocs.find((candidate) => candidate.pageId === page.id);
    expect(doc).toBeDefined();
    expect(doc?.status).toBe('not_started');
    expect(doc?.openQuestions).toEqual([]);
  });

  it('adds a component with an empty documentation record', async () => {
    const project = await createProject({ name: 'Doc test' });
    const updated = await addComponent(project.id, 'Dropdown');

    expect(updated.components).toHaveLength(1);
    expect(updated.components[0]!.name).toBe('Dropdown');
    expect(updated.components[0]!.status).toBe('not_started');
  });

  it('updates page documentation and persists it', async () => {
    const project = await createProject({ name: 'Doc test' });
    const withPage = await addPage(project.id, 'Checkout');
    const page = withPage.pages[0]!;

    await updatePageDocumentation(project.id, page.id, {
      status: 'in_progress',
      overview: 'The checkout page.',
      interactions: [{ id: 'i1', trigger: 'click', description: 'Submits the order.' }],
    });

    const reloaded = await getProject(project.id);
    const doc = reloaded?.pageDocs.find((candidate) => candidate.pageId === page.id);

    expect(doc?.status).toBe('in_progress');
    expect(doc?.overview).toBe('The checkout page.');
    expect(doc?.interactions).toHaveLength(1);
  });

  it('updates component documentation — states, properties, and notes — and persists it', async () => {
    const project = await createProject({ name: 'Doc test' });
    const withComponent = await addComponent(project.id, 'Dropdown');
    const component = withComponent.components[0]!;

    await updateComponentDocumentation(project.id, component.id, {
      status: 'documented',
      states: [{ id: 's1', name: 'Open', description: 'Menu is expanded.' }],
      properties: [
        {
          id: 'p1',
          name: 'disabled',
          type: 'boolean',
          required: false,
          description: 'Disables the trigger.',
        },
      ],
      implementationNotes: 'Closes on outside click or Escape.',
    });

    const reloaded = await getProject(project.id);
    const doc = reloaded?.components.find((candidate) => candidate.id === component.id);

    expect(doc?.status).toBe('documented');
    expect(doc?.states).toHaveLength(1);
    expect(doc?.states[0]!.name).toBe('Open');
    expect(doc?.properties).toHaveLength(1);
    expect(doc?.implementationNotes).toBe('Closes on outside click or Escape.');
  });

  it('survives a simulated reload with edits intact', async () => {
    const project = await createProject({ name: 'Reload test' });
    const withPage = await addPage(project.id, 'Home');
    const page = withPage.pages[0]!;

    await updatePageDocumentation(project.id, page.id, {
      status: 'documented',
      purpose: 'The entry point of the app.',
    });

    // Simulate closing and reopening the browser: read straight from Dexie
    // via a fresh getProject call rather than any in-memory reference.
    const reopened = await getProject(project.id);
    const doc = reopened?.pageDocs.find((candidate) => candidate.pageId === page.id);

    expect(doc?.purpose).toBe('The entry point of the app.');
    expect(doc?.status).toBe('documented');
  });
});
