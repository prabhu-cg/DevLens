import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Textarea } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { newProjectSchema } from '../../schemas/project.schema';
import type { NewProjectFormValues } from '../../schemas/project.schema';
import { useProjectStore } from '../../store/useProjectStore';
import { generateId } from '../../utils/id';
import styles from './NewProjectPage.module.css';

export function NewProjectPage() {
  const navigate = useNavigate();
  const addProject = useProjectStore((state) => state.addProject);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewProjectFormValues>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = (values: NewProjectFormValues) => {
    const now = new Date().toISOString();
    const projectId = generateId();

    addProject({
      id: projectId,
      name: values.name,
      description: values.description,
      createdAt: now,
      updatedAt: now,
      pages: [],
    });

    showToast({ title: 'Project created', description: values.name, variant: 'success' });
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>New project</h1>
      <p className={styles.subtitle}>
        Give your project a name to get started. You&apos;ll import a Figma file in a later step.
      </p>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Project name"
          placeholder="e.g. Checkout redesign"
          required
          error={errors.name?.message}
          {...register('name')}
        />
        <Textarea
          label="Description"
          placeholder="Optional context for this project"
          error={errors.description?.message}
          {...register('description')}
        />
        <div className={styles.actions}>
          <Button type="submit" isLoading={isSubmitting}>
            Create project
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/projects')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
