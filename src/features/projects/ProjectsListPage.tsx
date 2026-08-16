import { FolderOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Button, Card, EmptyState } from '../../components/ui';
import { useProjectStore } from '../../store/useProjectStore';
import styles from './ProjectsListPage.module.css';

export function ProjectsListPage() {
  const projects = useProjectStore((state) => state.projects);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>Everything you import stays on this device.</p>
        </div>
        <Button asChild>
          <NavLink to="/projects/new">New project</NavLink>
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={40} aria-hidden="true" />}
          title="No projects yet"
          description="Start a project to import a design file and begin documenting it."
          action={
            <Button asChild>
              <NavLink to="/projects/new">New project</NavLink>
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <Card key={project.id} interactive>
              <NavLink to={`/projects/${project.id}`} className={styles.projectName}>
                {project.name}
              </NavLink>
              <p className={styles.projectMeta}>{project.pages.length} pages</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
