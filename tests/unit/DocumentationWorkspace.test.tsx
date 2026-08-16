import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../../src/app/routes';
import { ToastProvider, TooltipProvider } from '../../src/components/ui';
import { db } from '../../src/services/storage/db';
import { seedSampleProject } from '../../src/services/storage/projectStorage';
import { useProjectStore } from '../../src/store/useProjectStore';

beforeEach(async () => {
  await db.projects.clear();
  await db.projectVersions.clear();
  await db.settings.clear();
  useProjectStore.setState({ projects: [], status: 'idle' });
});

function renderAt(initialPath: string) {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  return render(
    <ToastProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ToastProvider>,
  );
}

describe('documentation workspace', () => {
  it('documents a page, documents a component with states/properties/notes, and survives a reload', async () => {
    const user = userEvent.setup();
    const sample = await seedSampleProject();
    await useProjectStore.getState().loadProjects();
    const transactionsPage = sample.pages.find((page) => page.name === 'Transactions')!;
    const inputComponent = sample.components.find((component) => component.name === 'Input')!;

    // --- Select a page and document it ---
    const { unmount: unmountPage } = renderAt(
      `/projects/${sample.id}/pages/${transactionsPage.id}`,
    );

    await screen.findByRole('heading', { level: 1, name: 'Transactions' });
    const overviewField = screen.getByPlaceholderText('A brief summary of this page.');
    await user.type(overviewField, 'Lists every transaction across all accounts.');

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/saved locally/i), {
      timeout: 3000,
    });

    unmountPage();

    const savedPage = await db.projects.get(sample.id);
    const pageDoc = savedPage?.pageDocs.find((doc) => doc.pageId === transactionsPage.id);
    expect(pageDoc?.overview).toBe('Lists every transaction across all accounts.');

    // --- Select a component and document it: add a state, a property, a note ---
    const { unmount: unmountComponent } = renderAt(
      `/projects/${sample.id}/components/${inputComponent.id}`,
    );

    await screen.findByRole('heading', { level: 1, name: 'Input' });

    await user.click(screen.getByRole('button', { name: /add state/i }));
    const stateNameField = screen.getByPlaceholderText('e.g. Loading');
    await user.type(stateNameField, 'Invalid');

    await user.click(screen.getByRole('button', { name: /add property/i }));
    const propertyNameField = screen.getByPlaceholderText('e.g. variant');
    await user.type(propertyNameField, 'placeholder');

    await user.click(screen.getByRole('button', { name: /add question/i }));
    const questionField = screen.getByPlaceholderText('What needs an answer?');
    await user.type(questionField, 'Should input support a clear button?');

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/saved locally/i), {
      timeout: 3000,
    });

    unmountComponent();

    // --- Reload: re-open the same component from a fresh render and confirm edits persisted ---
    renderAt(`/projects/${sample.id}/components/${inputComponent.id}`);

    await screen.findByRole('heading', { level: 1, name: 'Input' });
    expect(await screen.findByDisplayValue('Invalid')).toBeInTheDocument();
    expect(screen.getByDisplayValue('placeholder')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Should input support a clear button?')).toBeInTheDocument();

    // Continue editing after reload.
    const stateField = screen.getByDisplayValue('Invalid');
    await user.type(stateField, ' state');

    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/saved locally/i), {
      timeout: 3000,
    });

    const finalProject = await db.projects.get(sample.id);
    const componentDoc = finalProject?.components.find((c) => c.id === inputComponent.id);
    expect(componentDoc?.states.map((s) => s.name)).toContain('Invalid state');
    expect(componentDoc?.properties.map((p) => p.name)).toContain('placeholder');
    expect(componentDoc?.openQuestions.map((q) => q.question)).toContain(
      'Should input support a clear button?',
    );
  }, 15000);
});
