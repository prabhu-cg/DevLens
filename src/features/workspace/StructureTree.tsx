import { useMemo, useState } from 'react';
import { ChevronRight, Plus, Search } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Dialog, IconButton, Input } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { useProject, useProjectStore } from '../../store/useProjectStore';
import { DocStatusBadge } from './DocStatusBadge';
import { cn } from '../../utils/cn';
import styles from './StructureTree.module.css';

type GroupKey = 'pages' | 'components' | 'tokens' | 'interactions';

export function StructureTree() {
  const { projectId, pageId, componentId } = useParams<{
    projectId: string;
    pageId?: string;
    componentId?: string;
  }>();
  const project = useProject(projectId);
  const navigate = useNavigate();
  const addPage = useProjectStore((state) => state.addPage);
  const addComponent = useProjectStore((state) => state.addComponent);
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<Record<GroupKey, boolean>>({
    pages: true,
    components: true,
    tokens: false,
    interactions: false,
  });
  const [addDialog, setAddDialog] = useState<'pages' | 'components' | null>(null);
  const [newName, setNewName] = useState('');

  const toggleGroup = (key: GroupKey) => {
    setExpanded((current) => ({ ...current, [key]: !current[key] }));
  };

  const filteredPages = useMemo(() => {
    const pages = project?.pages ?? [];
    const sorted = [...pages].sort((a, b) => a.order - b.order);
    if (!query.trim()) return sorted;
    return sorted.filter((page) => page.name.toLowerCase().includes(query.trim().toLowerCase()));
  }, [project?.pages, query]);

  const filteredComponents = useMemo(() => {
    const components = project?.components ?? [];
    if (!query.trim()) return components;
    return components.filter((component) =>
      component.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [project?.components, query]);

  if (!project) return null;

  const openAddDialog = (group: 'pages' | 'components') => {
    setNewName('');
    setAddDialog(group);
  };

  const handleAddConfirm = async () => {
    const trimmed = newName.trim();
    if (!trimmed || !projectId) return;

    try {
      if (addDialog === 'pages') {
        const updated = await addPage(projectId, trimmed);
        setAddDialog(null);
        const created = updated.pages[updated.pages.length - 1];
        if (created) navigate(`/projects/${projectId}/pages/${created.id}`);
      } else if (addDialog === 'components') {
        const updated = await addComponent(projectId, trimmed);
        setAddDialog(null);
        const created = updated.components[updated.components.length - 1];
        if (created) navigate(`/projects/${projectId}/components/${created.id}`);
      }
    } catch {
      showToast({ title: 'Could not add item', variant: 'error' });
    }
  };

  return (
    <div className={styles.tree}>
      <div className={styles.searchWrapper}>
        <Search size={14} className={styles.searchIcon} aria-hidden="true" />
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search structure…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search pages and components"
        />
      </div>

      <div className={styles.groups}>
        <TreeGroup
          groupKey="pages"
          label="Pages"
          count={filteredPages.length}
          expanded={expanded.pages}
          onToggle={() => toggleGroup('pages')}
          onAdd={() => openAddDialog('pages')}
          addLabel="Add page"
        >
          {filteredPages.length === 0 ? (
            <p className={styles.emptyGroup}>No pages yet.</p>
          ) : (
            filteredPages.map((page) => (
              <button
                key={page.id}
                type="button"
                className={cn(styles.item, page.id === pageId && styles.itemActive)}
                aria-current={page.id === pageId ? 'true' : undefined}
                onClick={() => navigate(`/projects/${projectId}/pages/${page.id}`)}
              >
                <DocStatusBadge
                  status={
                    project.pageDocs.find((doc) => doc.pageId === page.id)?.status ?? 'not_started'
                  }
                  hideLabel
                />
                <span className={styles.itemName}>{page.name}</span>
              </button>
            ))
          )}
        </TreeGroup>

        <TreeGroup
          groupKey="components"
          label="Components"
          count={filteredComponents.length}
          expanded={expanded.components}
          onToggle={() => toggleGroup('components')}
          onAdd={() => openAddDialog('components')}
          addLabel="Add component"
        >
          {filteredComponents.length === 0 ? (
            <p className={styles.emptyGroup}>No components yet.</p>
          ) : (
            filteredComponents.map((component) => (
              <button
                key={component.id}
                type="button"
                className={cn(styles.item, component.id === componentId && styles.itemActive)}
                aria-current={component.id === componentId ? 'true' : undefined}
                onClick={() => navigate(`/projects/${projectId}/components/${component.id}`)}
              >
                <DocStatusBadge status={component.status} hideLabel />
                <span className={styles.itemName}>{component.name}</span>
              </button>
            ))
          )}
        </TreeGroup>

        <TreeGroup
          groupKey="tokens"
          label="Tokens"
          count={0}
          expanded={expanded.tokens}
          onToggle={() => toggleGroup('tokens')}
        >
          <p className={styles.emptyGroup}>Not available yet.</p>
        </TreeGroup>

        <TreeGroup
          groupKey="interactions"
          label="Interactions"
          count={0}
          expanded={expanded.interactions}
          onToggle={() => toggleGroup('interactions')}
        >
          <p className={styles.emptyGroup}>Not available yet.</p>
        </TreeGroup>
      </div>

      <Dialog
        open={addDialog !== null}
        onOpenChange={(open) => !open && setAddDialog(null)}
        title={addDialog === 'pages' ? 'Add page' : 'Add component'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleAddConfirm}>Add</Button>
          </>
        }
      >
        <Input
          label={addDialog === 'pages' ? 'Page name' : 'Component name'}
          hideLabel
          placeholder={addDialog === 'pages' ? 'e.g. Checkout' : 'e.g. Dropdown'}
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
      </Dialog>
    </div>
  );
}

interface TreeGroupProps {
  groupKey: GroupKey;
  label: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
  onAdd?: () => void;
  addLabel?: string;
  children: React.ReactNode;
}

function TreeGroup({
  label,
  count,
  expanded,
  onToggle,
  onAdd,
  addLabel,
  children,
}: TreeGroupProps) {
  return (
    <div className={styles.group}>
      <div className={styles.groupHeader}>
        <button type="button" className={styles.groupToggle} onClick={onToggle}>
          <ChevronRight
            size={14}
            className={cn(styles.chevron, expanded && styles.chevronOpen)}
            aria-hidden="true"
          />
          {label}
          <span className={styles.groupCount}>{count}</span>
        </button>
        {onAdd && (
          <IconButton
            icon={<Plus size={14} aria-hidden="true" />}
            label={addLabel ?? `Add to ${label}`}
            size="sm"
            onClick={onAdd}
          />
        )}
      </div>
      {expanded && <div className={styles.items}>{children}</div>}
    </div>
  );
}
