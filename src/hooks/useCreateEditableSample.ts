import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { useToast } from '../components/ui/Toast';

/** Seeds the FinEdge sample project into local storage and opens its dashboard. */
export function useCreateEditableSample() {
  const navigate = useNavigate();
  const createSampleProject = useProjectStore((state) => state.createSampleProject);
  const { showToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  const createEditableSample = async () => {
    setIsCreating(true);
    try {
      const project = await createSampleProject();
      showToast({
        title: 'Editable copy created',
        description: project.name,
        variant: 'success',
      });
      navigate(`/projects/${project.id}`);
    } catch {
      showToast({ title: 'Could not create a copy', variant: 'error' });
    } finally {
      setIsCreating(false);
    }
  };

  return { createEditableSample, isCreating };
}
