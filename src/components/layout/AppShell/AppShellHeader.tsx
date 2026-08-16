import { ChevronDown, Download, Gauge, Search } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge, Dropdown } from '../../ui';
import { useToast } from '../../ui/Toast';
import { useProjectStore } from '../../../store/useProjectStore';
import { useCommandPaletteStore } from '../../../store/useCommandPaletteStore';
import logo from '../../../assets/devlens-logo.svg';
import styles from './AppShellHeader.module.css';

export function AppShellHeader() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const projects = useProjectStore((state) => state.projects);
  const openCommandPalette = useCommandPaletteStore((state) => state.open);
  const { showToast } = useToast();

  const activeProject = projects.find((project) => project.id === projectId);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          <img src={logo} alt="" className={styles.mark} />
          <span className={styles.name}>
            Dev<span className={styles.accent}>Lens</span>
          </span>
        </Link>

        <span className={styles.divider} aria-hidden="true" />

        <Dropdown
          align="start"
          trigger={
            <button type="button" className={styles.projectTrigger}>
              <span className={styles.projectTriggerLabel}>
                {activeProject ? activeProject.name : 'Select project'}
              </span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
          }
          items={
            projects.length > 0
              ? projects.map((project) => ({
                  value: project.id,
                  label: project.name,
                  onSelect: () => navigate(`/projects/${project.id}`),
                }))
              : [{ value: 'empty', label: 'No projects yet', disabled: true }]
          }
        />

        <button
          type="button"
          className={styles.search}
          onClick={openCommandPalette}
          aria-label="Search DevLens (Command K)"
        >
          <span className={styles.searchWrapper}>
            <Search size={14} className={styles.searchIcon} aria-hidden="true" />
            <span className={styles.searchInput} style={{ display: 'flex', alignItems: 'center' }}>
              Search…
            </span>
            <span className={styles.kbd} aria-hidden="true">
              {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl K'}
            </span>
          </span>
        </button>

        <span className={styles.spacer} />

        <div className={styles.actions}>
          <Badge variant="neutral">
            <Gauge size={12} aria-hidden="true" style={{ marginRight: 4 }} />
            Readiness not yet calculated
          </Badge>
          <button
            type="button"
            className={styles.projectTrigger}
            onClick={() =>
              showToast({
                title: 'Export not available yet',
                description: 'Documentation export ships in a later phase.',
                variant: 'neutral',
              })
            }
          >
            <Download size={14} aria-hidden="true" />
            Export
          </button>
        </div>
      </div>
    </header>
  );
}
