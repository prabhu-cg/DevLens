import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../../src/app/routes';
import { ToastProvider, TooltipProvider } from '../../src/components/ui';

function renderApp(initialPath = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [initialPath] });
  return render(
    <ToastProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ToastProvider>,
  );
}

describe('App', () => {
  it('renders without crashing at the root route', () => {
    renderApp('/');
    expect(screen.getByText('DevLens')).toBeInTheDocument();
  });

  it('renders the landing page headline', () => {
    renderApp('/');
    expect(
      screen.getByRole('heading', { level: 1, name: /from pixels to implementation clarity/i }),
    ).toBeInTheDocument();
  });
});
