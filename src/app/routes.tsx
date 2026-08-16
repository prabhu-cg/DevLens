import { Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { MarketingLayout, NotFound } from '../components/layout';
import { LandingPage, TermsPage } from '../features/landing';
import {
  AppShellLayout,
  ComponentDocumentationView,
  NewProjectPage,
  PageDocumentationView,
  ProjectDetailPage,
  ProjectsListPage,
  RouteFallback,
  SamplePage,
} from './lazyRoutes';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MarketingLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '/sample',
    element: (
      <Suspense fallback={<RouteFallback />}>
        <SamplePage />
      </Suspense>
    ),
  },
  {
    path: '/projects',
    element: (
      <Suspense fallback={<RouteFallback />}>
        <AppShellLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <ProjectsListPage /> },
      { path: 'new', element: <NewProjectPage /> },
      { path: ':projectId', element: <ProjectDetailPage /> },
      { path: ':projectId/pages/:pageId', element: <PageDocumentationView /> },
      { path: ':projectId/components/:componentId', element: <ComponentDocumentationView /> },
    ],
  },
];
