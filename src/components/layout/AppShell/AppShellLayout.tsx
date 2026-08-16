import { Outlet, useParams } from 'react-router-dom';
import { AppShellHeader } from './AppShellHeader';
import { Sidebar } from './Sidebar';
import { ContextPanel } from '../../../features/workspace/ContextPanel';
import styles from './AppShellLayout.module.css';

export function AppShellLayout() {
  const { projectId } = useParams<{ projectId?: string }>();

  return (
    <div className={styles.shell}>
      <a href="#workspace-main" className="skip-link">
        Skip to workspace
      </a>
      <AppShellHeader />
      <div className={styles.body}>
        <Sidebar />
        <main id="workspace-main" className={styles.main}>
          <Outlet />
        </main>
        {projectId && (
          <aside className={styles.rightPanel} aria-label="Contextual details">
            <ContextPanel />
          </aside>
        )}
      </div>
    </div>
  );
}
