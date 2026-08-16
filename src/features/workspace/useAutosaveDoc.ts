import { useEffect, useState } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved';

const AUTOSAVE_DELAY_MS = 800;

/**
 * Debounce-saves `value` whenever it changes, skipping the save that would
 * otherwise fire right after `resetKey` changes (e.g. switching from one
 * page/component to another re-seeds local state, which isn't a real edit).
 *
 * The "dirty" (unsaved) state is derived during render by comparing `value`
 * against a baseline tracked in state, rather than set imperatively inside
 * the effect — only the actual async save transitions (`saving` / `saved`)
 * are set from within the effect's deferred callbacks.
 */
export function useAutosaveDoc<T>(
  value: T,
  resetKey: string,
  save: (value: T) => Promise<unknown>,
): SaveStatus {
  const [asyncStatus, setAsyncStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [tracked, setTracked] = useState({ resetKey, baseline: value });

  // Adjusting state during render on prop change, per
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (resetKey !== tracked.resetKey) {
    setTracked({ resetKey, baseline: value });
    if (asyncStatus !== 'idle') setAsyncStatus('idle');
  }

  const isDirty = value !== tracked.baseline;

  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      setAsyncStatus('saving');
      save(value)
        .then(() => {
          setTracked((current) => ({ ...current, baseline: value }));
          setAsyncStatus('saved');
        })
        .catch(() => setAsyncStatus('idle'));
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(timer);
    // `save` is a stable store action reference; only re-run on real value changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, isDirty]);

  if (isDirty && asyncStatus !== 'saving') return 'unsaved';
  return asyncStatus;
}
