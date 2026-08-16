import type { RouteObject } from 'react-router-dom';
import { AppLayout, NotFound } from '../components/layout';
import { LandingPage } from '../features/landing';
import { ProjectsListPage, NewProjectPage, ProjectDetailPage } from '../features/projects';
import { SamplePage } from '../features/documentation';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'projects', element: <ProjectsListPage /> },
      { path: 'projects/new', element: <NewProjectPage /> },
      { path: 'projects/:projectId', element: <ProjectDetailPage /> },
      { path: 'sample', element: <SamplePage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
];
