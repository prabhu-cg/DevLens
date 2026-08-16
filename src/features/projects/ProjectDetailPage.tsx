import { useParams, Navigate, NavLink } from 'react-router-dom';
import { Badge, Button, EmptyState } from '../../components/ui';
import { useProjectStore } from '../../store/useProjectStore';
import styles from './ProjectDetailPage.module.css';

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = useProjectStore((state) =>
    state.projects.find((candidate) => candidate.id === projectId),
  );

  if (!projectId) {
    return <Navigate to="/projects" replace />;
  }

  if (!project) {
    return (
      <div className={styles.page}>
        <EmptyState
          title="Project not found"
          description="This project may have been removed, or you refreshed after clearing state."
          action={
            <Button asChild>
              <NavLink to="/projects">Back to projects</NavLink>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{project.name}</h1>
      {project.description && <p className={styles.description}>{project.description}</p>}
      <div className={styles.meta}>
        <Badge variant="neutral">{project.pages.length} pages</Badge>
        <Badge variant="brand">No file imported yet</Badge>
      </div>
    </div>
  );
}
