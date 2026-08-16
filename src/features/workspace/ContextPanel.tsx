import { useParams } from 'react-router-dom';
import { MousePointerSquareDashed } from 'lucide-react';
import { Badge, EmptyState } from '../../components/ui';
import { useProject, useProjectStore } from '../../store/useProjectStore';
import { StatusSelect } from './StatusSelect';
import styles from './ContextPanel.module.css';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function ContextPanel() {
  const { projectId, pageId, componentId } = useParams<{
    projectId?: string;
    pageId?: string;
    componentId?: string;
  }>();
  const project = useProject(projectId);
  const updatePageDoc = useProjectStore((state) => state.updatePageDoc);
  const updateComponentDoc = useProjectStore((state) => state.updateComponentDoc);

  if (!project || !projectId) {
    return (
      <EmptyState
        icon={<MousePointerSquareDashed size={28} aria-hidden="true" />}
        title="Nothing selected"
        description="Select a page or component to see its details here."
      />
    );
  }

  const page = pageId ? project.pages.find((candidate) => candidate.id === pageId) : undefined;
  const pageDoc = pageId ? project.pageDocs.find((doc) => doc.pageId === pageId) : undefined;

  if (page && pageDoc) {
    const openCount = pageDoc.openQuestions.filter((question) => question.status === 'open').length;
    return (
      <div className={styles.panel}>
        <div>
          <span className={styles.kicker}>Page</span>
          <h2 className={styles.name}>{page.name}</h2>
        </div>
        <StatusSelect
          status={pageDoc.status}
          onChange={(nextStatus) => updatePageDoc(projectId, pageId!, { status: nextStatus })}
        />
        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Updated</span>
            <span className={styles.metaValue}>{formatDate(pageDoc.updatedAt)}</span>
          </div>
        </div>
        <div className={styles.questions}>
          <span>Open questions</span>
          <Badge variant={openCount > 0 ? 'warning' : 'neutral'}>{openCount}</Badge>
        </div>
      </div>
    );
  }

  const component = componentId
    ? project.components.find((candidate) => candidate.id === componentId)
    : undefined;

  if (component) {
    const openCount = component.openQuestions.filter(
      (question) => question.status === 'open',
    ).length;
    return (
      <div className={styles.panel}>
        <div>
          <span className={styles.kicker}>Component</span>
          <h2 className={styles.name}>{component.name}</h2>
        </div>
        <StatusSelect
          status={component.status}
          onChange={(nextStatus) =>
            updateComponentDoc(projectId, componentId!, { status: nextStatus })
          }
        />
        <div className={styles.meta}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Created</span>
            <span className={styles.metaValue}>{formatDate(component.createdAt)}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Updated</span>
            <span className={styles.metaValue}>{formatDate(component.updatedAt)}</span>
          </div>
        </div>
        <div className={styles.questions}>
          <span>Open questions</span>
          <Badge variant={openCount > 0 ? 'warning' : 'neutral'}>{openCount}</Badge>
        </div>
      </div>
    );
  }

  return (
    <EmptyState
      icon={<MousePointerSquareDashed size={28} aria-hidden="true" />}
      title="Nothing selected"
      description="Select a page or component to see its details here."
    />
  );
}
