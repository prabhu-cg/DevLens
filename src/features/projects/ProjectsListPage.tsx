import { useRef, useState } from 'react';
import { Copy, FolderOpen, MoreHorizontal, Trash2, Upload } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  Dialog,
  Dropdown,
  EmptyState,
  IconButton,
  Skeleton,
} from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { useProjectStore } from '../../store/useProjectStore';
import { InvalidProjectFileError } from '../../services/storage';
import type { Project } from '../../domain/project';
import styles from './ProjectsListPage.module.css';

export function ProjectsListPage() {
  const projects = useProjectStore((state) => state.projects);
  const status = useProjectStore((state) => state.status);
  const duplicateProject = useProjectStore((state) => state.duplicateProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const importProject = useProjectStore((state) => state.importProject);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const project = await importProject(text);
      showToast({ title: 'Project imported', description: project.name, variant: 'success' });
    } catch (error) {
      showToast({
        title: 'Import failed',
        description:
          error instanceof InvalidProjectFileError
            ? error.message
            : 'Something went wrong reading that file.',
        variant: 'error',
      });
    }
  };

  const handleDuplicate = async (id: string, name: string) => {
    try {
      await duplicateProject(id);
      showToast({ title: 'Project duplicated', description: name, variant: 'success' });
    } catch {
      showToast({ title: 'Could not duplicate project', variant: 'error' });
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id, name } = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteProject(id);
      showToast({ title: 'Project deleted', description: name, variant: 'neutral' });
    } catch {
      showToast({ title: 'Could not delete project', variant: 'error' });
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.subtitle}>Everything you import stays on this device.</p>
        </div>
        <div className={styles.headerActions}>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-hidden="true"
            tabIndex={-1}
            onChange={handleFileSelected}
          />
          <Button variant="secondary" onClick={handleImportClick}>
            <Upload size={16} aria-hidden="true" />
            Import project
          </Button>
          <Button asChild>
            <NavLink to="/projects/new">New project</NavLink>
          </Button>
        </div>
      </div>

      {status === 'loading' && projects.length === 0 ? (
        <div className={styles.grid}>
          {[1, 2, 3].map((key) => (
            <Card key={key} className={styles.skeletonCard}>
              <Skeleton width="70%" height={20} />
              <Skeleton width="100%" height={14} />
              <Skeleton width="40%" height={14} />
            </Card>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderOpen size={40} aria-hidden="true" />}
          title="No project selected."
          description="Create a project or explore the sample handoff."
          action={
            <Button asChild>
              <NavLink to="/projects/new">Create project</NavLink>
            </Button>
          }
          secondaryAction={
            <Button asChild variant="secondary">
              <NavLink to="/sample">View sample</NavLink>
            </Button>
          }
        />
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <Card key={project.id} className={styles.card}>
              <div className={styles.cardTop}>
                <NavLink to={`/projects/${project.id}`} className={styles.projectName}>
                  {project.name}
                </NavLink>
                <Dropdown
                  align="end"
                  trigger={
                    <IconButton
                      icon={<MoreHorizontal size={16} aria-hidden="true" />}
                      label={`Actions for ${project.name}`}
                      size="sm"
                    />
                  }
                  items={[
                    {
                      value: 'duplicate',
                      label: 'Duplicate',
                      icon: <Copy size={14} aria-hidden="true" />,
                      onSelect: () => handleDuplicate(project.id, project.name),
                    },
                    {
                      value: 'delete',
                      label: 'Delete',
                      icon: <Trash2 size={14} aria-hidden="true" />,
                      destructive: true,
                      onSelect: () => setPendingDelete(project),
                    },
                  ]}
                />
              </div>
              {project.description && (
                <p className={styles.projectDescription}>{project.description}</p>
              )}
              <div className={styles.projectMeta}>
                <Badge variant="neutral">v{project.version}</Badge>
                <span>{project.pages.length} pages</span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete project?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" will be permanently removed from this browser. This cannot be undone.`
            : undefined
        }
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete project
            </Button>
          </>
        }
      />
    </div>
  );
}
