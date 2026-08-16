import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ToastProvider, TooltipProvider } from '../components/ui';
import { CommandPalette } from '../components/command-palette';
import { useProjectStore } from '../store/useProjectStore';
import { router } from './router';

export function App() {
  const loadProjects = useProjectStore((state) => state.loadProjects);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <ToastProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
        <CommandPalette />
      </TooltipProvider>
    </ToastProvider>
  );
}
