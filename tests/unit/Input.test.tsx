import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../../src/components/ui';

describe('Input', () => {
  it('associates the label with the field', () => {
    render(<Input label="Project name" />);
    expect(screen.getByLabelText('Project name')).toBeInTheDocument();
  });

  it('accepts typed input', async () => {
    const user = userEvent.setup();
    render(<Input label="Project name" />);

    const input = screen.getByLabelText('Project name');
    await user.type(input, 'Checkout redesign');

    expect(input).toHaveValue('Checkout redesign');
  });

  it('exposes an error message via aria-describedby', () => {
    render(<Input label="Project name" error="Project name is required" />);

    const input = screen.getByLabelText('Project name');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Project name is required');
  });
});
