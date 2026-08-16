import { describe, expect, it } from 'vitest';
import '../../src/styles/global.css';

describe('design tokens', () => {
  it('exposes the DevLens brand colours as CSS custom properties', () => {
    const styles = getComputedStyle(document.documentElement);

    expect(styles.getPropertyValue('--color-primary').trim().toLowerCase()).toBe('#c74504');
    expect(styles.getPropertyValue('--color-text').trim().toLowerCase()).toBe('#444444');
  });

  it('defines the 8px-based spacing scale', () => {
    const styles = getComputedStyle(document.documentElement);

    expect(styles.getPropertyValue('--space-4').trim()).toBe('1rem');
    expect(styles.getPropertyValue('--space-8').trim()).toBe('2rem');
  });

  it('sets Manrope as the base font family', () => {
    const styles = getComputedStyle(document.documentElement);

    expect(styles.getPropertyValue('--font-family-base')).toContain('Manrope');
  });
});
