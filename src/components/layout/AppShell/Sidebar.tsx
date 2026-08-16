import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Accessibility,
  Component,
  FileText,
  History,
  LayoutDashboard,
  MessageCircleQuestion,
  MousePointerClick,
  Palette,
  ShieldAlert,
  Smartphone,
  CircleHelp,
} from 'lucide-react';
import { StructureTree } from '../../../features/workspace/StructureTree';
import { cn } from '../../../utils/cn';
import styles from './Sidebar.module.css';

const items = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'pages', label: 'Pages', icon: FileText },
  { id: 'components', label: 'Components', icon: Component },
  { id: 'tokens', label: 'Tokens', icon: Palette },
  { id: 'interactions', label: 'Interactions', icon: MousePointerClick },
  { id: 'responsive', label: 'Responsive', icon: Smartphone },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'audit', label: 'Audit', icon: ShieldAlert },
  { id: 'questions', label: 'Developer questions', icon: MessageCircleQuestion },
  { id: 'open-questions', label: 'Open questions', icon: CircleHelp },
  { id: 'changelog', label: 'Changelog', icon: History },
];

function GenericSidebar() {
  const [active, setActive] = useState('overview');

  return (
    <nav className={cn(styles.sidebar, styles.generic)} aria-label="Workspace sections">
      <span className={styles.groupLabel}>Workspace</span>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={cn(styles.item, isActive && styles.itemActive)}
            aria-current={isActive ? 'true' : undefined}
            onClick={() => setActive(item.id)}
          >
            <Icon size={16} className={styles.icon} aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const { projectId } = useParams<{ projectId?: string }>();

  if (projectId) {
    return (
      <nav className={styles.sidebar} aria-label="Project structure">
        <StructureTree />
      </nav>
    );
  }

  return <GenericSidebar />;
}
