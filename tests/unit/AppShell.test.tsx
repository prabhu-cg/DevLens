import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../../src/app/routes';
import { ToastProvider, TooltipProvider } from '../../src/components/ui';

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

describe('application shell', () => {
  it('renders the workspace sidebar on /projects routes', async () => {
    renderAt('/projects');

    expect(
      await screen.findByRole('navigation', { name: /workspace sections/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /select project/i })).toBeInTheDocument();
  });

  it('does not render the marketing header on app shell routes', async () => {
    renderAt('/projects');

    await screen.findByRole('navigation', { name: /workspace sections/i });
    expect(screen.queryByRole('navigation', { name: 'Primary' })).not.toBeInTheDocument();
  });
});
