import { RouterProvider } from 'react-router-dom';
import { ToastProvider, TooltipProvider } from '../components/ui';
import { router } from './router';

export function App() {
  return (
    <ToastProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ToastProvider>
  );
}
