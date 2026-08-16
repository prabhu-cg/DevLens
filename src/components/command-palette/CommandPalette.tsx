import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { router } from '../../app/router';
import {
  BookOpenCheck,
  Component,
  FileText,
  FolderOpen,
  LayoutDashboard,
  MessageCircleQuestion,
  Palette,
  Search,
  ShieldAlert,
} from 'lucide-react';
import { useCommandPaletteStore } from '../../store/useCommandPaletteStore';
import { useProjectStore } from '../../store/useProjectStore';
import { useToast } from '../ui/Toast';
import { cn } from '../../utils/cn';
import styles from './CommandPalette.module.css';

interface Command {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Search;
  run: () => void;
}

export function CommandPalette() {
  const isOpen = useCommandPaletteStore((state) => state.isOpen);
  const open = useCommandPaletteStore((state) => state.open);
  const close = useCommandPaletteStore((state) => state.close);
  const projects = useProjectStore((state) => state.projects);
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isMod = event.metaKey || event.ctrlKey;
      if (isMod && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const goToWorkspace = useCallback(
    (section: string) => {
      if (projects.length > 0) {
        router.navigate(`/projects/${projects[0]!.id}`);
      } else {
        showToast({
          title: 'No project yet',
          description: `Create a project to use ${section}.`,
          variant: 'neutral',
        });
        router.navigate('/projects/new');
      }
    },
    [projects, showToast],
  );

  const commands = useMemo<Command[]>(() => {
    const projectCommands: Command[] = projects.map((project) => ({
      id: `project-${project.id}`,
      label: project.name,
      hint: 'Open project',
      icon: FolderOpen,
      run: () => router.navigate(`/projects/${project.id}`),
    }));

    return [
      {
        id: 'search',
        label: 'Search',
        hint: 'Full search is coming in a later phase',
        icon: Search,
        run: () =>
          showToast({
            title: 'Search',
            description: 'Full-text search across projects arrives in a later phase.',
            variant: 'neutral',
          }),
      },
      {
        id: 'open-project',
        label: 'Open project',
        icon: FolderOpen,
        run: () => router.navigate('/projects'),
      },
      ...projectCommands,
      {
        id: 'overview',
        label: 'Overview',
        icon: LayoutDashboard,
        run: () => goToWorkspace('Overview'),
      },
      { id: 'pages', label: 'Pages', icon: FileText, run: () => goToWorkspace('Pages') },
      {
        id: 'components',
        label: 'Components',
        icon: Component,
        run: () => goToWorkspace('Components'),
      },
      { id: 'tokens', label: 'Tokens', icon: Palette, run: () => goToWorkspace('Tokens') },
      { id: 'audit', label: 'Audit', icon: ShieldAlert, run: () => goToWorkspace('Audit') },
      {
        id: 'questions',
        label: 'Developer questions',
        icon: MessageCircleQuestion,
        run: () => goToWorkspace('Developer questions'),
      },
      {
        id: 'sample',
        label: 'Sample handoff',
        icon: BookOpenCheck,
        run: () => router.navigate('/sample'),
      },
    ];
  }, [projects, showToast, goToWorkspace]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.trim().toLowerCase();
    return commands.filter((command) => command.label.toLowerCase().includes(q));
  }, [commands, query]);

  const runCommand = (command: Command) => {
    command.run();
    close();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const command = filtered[activeIndex];
      if (command) runCommand(command);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(next) => (next ? open() : close())}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.content}
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            setQuery('');
            setActiveIndex(0);
            inputRef.current?.focus();
          }}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <div className={styles.inputRow}>
            <Search size={16} className={styles.searchIcon} aria-hidden="true" />
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="Search actions, projects, sections…"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setActiveIndex(0);
              }}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded="true"
              aria-controls="command-palette-list"
              aria-activedescendant={filtered[activeIndex]?.id}
            />
          </div>
          <div className={styles.list} id="command-palette-list" role="listbox">
            {filtered.length === 0 ? (
              <p className={styles.empty}>No matching actions.</p>
            ) : (
              filtered.map((command, index) => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    id={command.id}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    className={cn(styles.item, index === activeIndex && styles.itemActive)}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => runCommand(command)}
                  >
                    <Icon size={16} className={styles.itemIcon} aria-hidden="true" />
                    {command.label}
                  </button>
                );
              })
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
