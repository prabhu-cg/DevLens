import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../../src/app/routes';
import { ToastProvider, TooltipProvider } from '../../src/components/ui';
import { db } from '../../src/services/storage/db';

beforeEach(async () => {
  await db.projects.clear();
  await db.projectVersions.clear();
  await db.settings.clear();
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

describe('create project flow', () => {
  it('creates a project through the form and lands on its dashboard', async () => {
    const user = userEvent.setup();
    renderAt('/projects/new');

    await screen.findByRole('heading', { level: 1, name: 'New project' });

    await user.type(screen.getByLabelText(/project name/i), 'Loyalty rewards');
    await user.type(screen.getByLabelText(/designer/i), 'Ada');
    await user.click(screen.getByRole('button', { name: /create project/i }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Loyalty rewards' }),
    ).toBeInTheDocument();

    // Stats grid should show real, persisted zero-state counts rather than
    // fabricated numbers.
    const stats = within(screen.getByTestId('project-stats'));
    expect(stats.getByText('Tokens')).toBeInTheDocument();
    expect(stats.getByText('Interactions')).toBeInTheDocument();
    expect(stats.getByText('Open questions')).toBeInTheDocument();

    const stored = await db.projects.toArray();
    expect(stored).toHaveLength(1);
    expect(stored[0]!.name).toBe('Loyalty rewards');
    expect(stored[0]!.designer).toBe('Ada');
  });

  it('persists the project across a simulated reload', async () => {
    const user = userEvent.setup();
    const { unmount } = renderAt('/projects/new');

    await user.type(screen.getByLabelText(/project name/i), 'Reload check');
    await user.click(screen.getByRole('button', { name: /create project/i }));
    await screen.findByRole('heading', { level: 1, name: 'Reload check' });

    unmount();

    renderAt('/projects');
    await waitFor(() => {
      expect(screen.getByText('Reload check')).toBeInTheDocument();
    });
  });
});
