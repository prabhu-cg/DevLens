import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../../src/app/routes';
import { ToastProvider, TooltipProvider } from '../../src/components/ui';
import { CommandPalette } from '../../src/components/command-palette';
import { useCommandPaletteStore } from '../../src/store/useCommandPaletteStore';

function renderApp() {
  const router = createMemoryRouter(routes, { initialEntries: ['/'] });
  return render(
    <ToastProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
        <CommandPalette />
      </TooltipProvider>
    </ToastProvider>,
  );
}

describe('CommandPalette', () => {
  beforeEach(() => {
    useCommandPaletteStore.setState({ isOpen: false });
  });

  it('opens with Cmd/Ctrl+K and lists known actions', async () => {
    const user = userEvent.setup();
    renderApp();

    expect(useCommandPaletteStore.getState().isOpen).toBe(false);

    await user.keyboard('{Control>}k{/Control}');

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /sample handoff/i })).toBeInTheDocument();
  });

  it('filters actions as the user types', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.keyboard('{Control>}k{/Control}');
    await user.type(screen.getByRole('combobox'), 'sample');

    expect(screen.getByRole('option', { name: /sample handoff/i })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /^tokens$/i })).not.toBeInTheDocument();
  });
});
