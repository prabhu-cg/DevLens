import { Outlet, useParams } from 'react-router-dom';
import { MousePointerSquareDashed } from 'lucide-react';
import { AppShellHeader } from './AppShellHeader';
import { Sidebar } from './Sidebar';
import { EmptyState } from '../../ui';
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
            <EmptyState
              icon={<MousePointerSquareDashed size={28} aria-hidden="true" />}
              title="Nothing selected"
              description="Select a component, token, or question to see its details here."
            />
          </aside>
        )}
      </div>
    </div>
  );
}
