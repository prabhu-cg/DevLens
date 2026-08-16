import { lazy } from 'react';
import { Spinner } from '../components/ui';

export const AppShellLayout = lazy(() =>
  import('../components/layout/AppShell/AppShellLayout').then((module) => ({
    default: module.AppShellLayout,
  })),
);

export const ProjectsListPage = lazy(() =>
  import('../features/projects/ProjectsListPage').then((module) => ({
    default: module.ProjectsListPage,
  })),
);

export const NewProjectPage = lazy(() =>
  import('../features/projects/NewProjectPage').then((module) => ({
    default: module.NewProjectPage,
  })),
);

export const ProjectDetailPage = lazy(() =>
  import('../features/projects/ProjectDetailPage').then((module) => ({
    default: module.ProjectDetailPage,
  })),
);

export const SamplePage = lazy(() =>
  import('../features/documentation/SamplePage').then((module) => ({
    default: module.SamplePage,
  })),
);

export function RouteFallback() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: 'var(--space-24)',
      }}
    >
      <Spinner label="Loading" />
    </div>
  );
}
