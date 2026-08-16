import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, NavLink, Navigate } from 'react-router-dom';
import { Copy, Download, Gauge, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Dialog,
  Dropdown,
  EmptyState,
  IconButton,
  Input,
  Skeleton,
  Textarea,
} from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { useProject, useProjectStore } from '../../store/useProjectStore';
import { projectDetailsSchema } from '../../schemas/project.schema';
import type { ProjectDetailsFormValues } from '../../schemas/project.schema';
import { serializeProject } from '../../services/storage';
import type { Project } from '../../domain/project';
import { cn } from '../../utils/cn';
import styles from './ProjectDetailPage.module.css';

type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved';

const AUTOSAVE_DELAY_MS = 800;

function downloadProjectFile(project: Project) {
  const json = serializeProject(project);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'project'}.devlens.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function SaveStatusIndicator({ status }: { status: SaveStatus }) {
  if (status === 'idle') return null;

  const label =
    status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved locally' : 'Unsaved changes';

  return (
    <span className={styles.saveStatus}>
      <span
        className={cn(
          styles.saveStatusDot,
          status === 'saved' && styles.saveStatusDotSaved,
          status === 'unsaved' && styles.saveStatusDotUnsaved,
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const status = useProjectStore((state) => state.status);
  const project = useProject(projectId);
  const updateProject = useProjectStore((state) => state.updateProject);
  const renameProject = useProjectStore((state) => state.renameProject);
  const duplicateProject = useProjectStore((state) => state.duplicateProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const { showToast } = useToast();

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);

  const projectRef = useRef<Project | undefined>(project);
  useEffect(() => {
    projectRef.current = project;
  }, [project]);

  const {
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectDetailsFormValues>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: { description: '', designer: '', version: '1.0' },
  });

  const suppressNextAutosave = useRef(false);

  useEffect(() => {
    if (!project) return;
    suppressNextAutosave.current = true;
    reset({
      description: project.description ?? '',
      designer: project.designer ?? '',
      version: project.version,
    });
    // Only re-run when switching to a different project.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  useEffect(() => {
    const debounceRef: { timer?: ReturnType<typeof setTimeout> } = {};

    const subscription = watch((values) => {
      if (suppressNextAutosave.current) {
        suppressNextAutosave.current = false;
        return;
      }

      setSaveStatus('unsaved');
      if (debounceRef.timer) clearTimeout(debounceRef.timer);

      debounceRef.timer = setTimeout(() => {
        const current = projectRef.current;
        if (!current) return;
        const parsed = projectDetailsSchema.safeParse(values);
        if (!parsed.success) return;

        setSaveStatus('saving');
        updateProject({ ...current, ...parsed.data })
          .then(() => setSaveStatus('saved'))
          .catch(() => setSaveStatus('unsaved'));
      }, AUTOSAVE_DELAY_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (debounceRef.timer) clearTimeout(debounceRef.timer);
    };
  }, [watch, updateProject]);

  if (!projectId) {
    return <Navigate to="/projects" replace />;
  }

  if (status !== 'ready' && !project) {
    return (
      <div className={styles.page}>
        <Skeleton width="40%" height={36} />
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Skeleton width="60%" height={16} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.page}>
        <EmptyState
          title="Project not found"
          description="This project may have been removed, or you refreshed after clearing browser storage."
          action={
            <Button asChild>
              <NavLink to="/projects">Back to projects</NavLink>
            </Button>
          }
        />
      </div>
    );
  }

  const handleRenameOpen = () => {
    setRenameValue(project.name);
    setRenameOpen(true);
  };

  const handleRenameSubmit = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed) return;
    try {
      await renameProject(project.id, trimmed);
      setRenameOpen(false);
      showToast({ title: 'Project renamed', description: trimmed, variant: 'success' });
    } catch {
      showToast({ title: 'Could not rename project', variant: 'error' });
    }
  };

  const handleDuplicate = async () => {
    try {
      const copy = await duplicateProject(project.id);
      showToast({ title: 'Project duplicated', description: copy.name, variant: 'success' });
      navigate(`/projects/${copy.id}`);
    } catch {
      showToast({ title: 'Could not duplicate project', variant: 'error' });
    }
  };

  const handleDelete = async () => {
    setDeleteOpen(false);
    try {
      await deleteProject(project.id);
      showToast({ title: 'Project deleted', description: project.name, variant: 'neutral' });
      navigate('/projects');
    } catch {
      showToast({ title: 'Could not delete project', variant: 'error' });
    }
  };

  const stats = [
    { label: 'Pages', value: project.pages.length },
    { label: 'Components', value: project.componentNames.length },
    { label: 'Tokens', value: 0 },
    { label: 'Interactions', value: 0 },
    { label: 'Open questions', value: 0 },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>{project.name}</h1>
            <IconButton
              icon={<Pencil size={14} aria-hidden="true" />}
              label="Rename project"
              size="sm"
              onClick={handleRenameOpen}
            />
          </div>
          <div className={styles.meta}>
            <Badge variant="neutral">v{project.version}</Badge>
            <Badge variant="brand">{project.source}</Badge>
            <span className={styles.metaText}>Updated {formatDate(project.updatedAt)}</span>
          </div>
        </div>
        <div className={styles.headerActions}>
          <SaveStatusIndicator status={saveStatus} />
          <Button variant="secondary" onClick={() => downloadProjectFile(project)}>
            <Download size={16} aria-hidden="true" />
            Export
          </Button>
          <Dropdown
            align="end"
            trigger={
              <IconButton
                icon={<MoreHorizontal size={16} aria-hidden="true" />}
                label="More actions"
              />
            }
            items={[
              {
                value: 'duplicate',
                label: 'Duplicate',
                icon: <Copy size={14} aria-hidden="true" />,
                onSelect: handleDuplicate,
              },
              {
                value: 'delete',
                label: 'Delete',
                icon: <Trash2 size={14} aria-hidden="true" />,
                destructive: true,
                onSelect: () => setDeleteOpen(true),
              },
            ]}
          />
        </div>
      </div>

      <div className={styles.statsGrid} data-testid="project-stats">
        {stats.map((stat) => (
          <Card key={stat.label} className={styles.statCard}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className={styles.body}>
        <div>
          <h2 className={styles.sectionTitle}>Project details</h2>
          <form className={styles.form} onSubmit={(event) => event.preventDefault()} noValidate>
            <Textarea
              label="Description"
              placeholder="What is this project for?"
              error={errors.description?.message}
              {...register('description')}
            />
            <div className={styles.formRow}>
              <Input
                label="Designer"
                placeholder="Optional"
                error={errors.designer?.message}
                {...register('designer')}
              />
              <Input
                label="Version"
                required
                error={errors.version?.message}
                {...register('version')}
              />
            </div>
          </form>
        </div>

        <div className={styles.side}>
          <div>
            <h2 className={styles.sectionTitle}>Handoff readiness</h2>
            <Card className={styles.readinessCard}>
              <div className={styles.readinessHeading}>
                <Badge variant="neutral">
                  <Gauge size={12} aria-hidden="true" style={{ marginRight: 4 }} />
                  Not yet calculated
                </Badge>
              </div>
              <p className={styles.readinessDescription}>
                Readiness is calculated once documentation begins in a later phase.
              </p>
            </Card>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>Pages</h2>
            <Card>
              {project.pages.length === 0 ? (
                <p className={styles.metaText}>No pages yet.</p>
              ) : (
                <div className={styles.pagesList}>
                  {project.pages.map((page, index) => (
                    <div key={page.id} className={styles.pageRow}>
                      <span className={styles.pageIndex}>{String(index + 1).padStart(2, '0')}</span>
                      {page.name}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Dialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        title="Rename project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setRenameOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameSubmit}>Save</Button>
          </>
        }
      >
        <Input
          label="Project name"
          hideLabel
          value={renameValue}
          onChange={(event) => setRenameValue(event.target.value)}
        />
      </Dialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete project?"
        description={`"${project.name}" will be permanently removed from this browser. This cannot be undone.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete project
            </Button>
          </>
        }
      />
    </div>
  );
}
