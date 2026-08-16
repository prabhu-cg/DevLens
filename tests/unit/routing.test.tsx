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

describe('routing', () => {
  it('renders the projects list at /projects', () => {
    renderAt('/projects');
    expect(screen.getByRole('heading', { level: 1, name: 'Projects' })).toBeInTheDocument();
  });

  it('renders the new project form at /projects/new', () => {
    renderAt('/projects/new');
    expect(screen.getByRole('heading', { level: 1, name: 'New project' })).toBeInTheDocument();
    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
  });

  it('renders the sample documentation at /sample', () => {
    renderAt('/sample');
    expect(screen.getByRole('heading', { level: 1, name: /checkout flow/i })).toBeInTheDocument();
  });

  it('renders a not-found page for an unknown route', () => {
    renderAt('/this-route-does-not-exist');
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });
});
