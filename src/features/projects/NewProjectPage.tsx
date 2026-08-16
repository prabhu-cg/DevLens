import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Textarea } from '../../components/ui';
import { useToast } from '../../components/ui/Toast';
import { newProjectSchema } from '../../schemas/project.schema';
import type { NewProjectFormValues } from '../../schemas/project.schema';
import { useProjectStore } from '../../store/useProjectStore';
import styles from './NewProjectPage.module.css';

export function NewProjectPage() {
  const navigate = useNavigate();
  const createProject = useProjectStore((state) => state.createProject);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewProjectFormValues>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: { name: '', description: '', designer: '', version: '' },
  });

  const onSubmit = async (values: NewProjectFormValues) => {
    try {
      const project = await createProject(values);
      showToast({ title: 'Project created', description: project.name, variant: 'success' });
      navigate(`/projects/${project.id}`);
    } catch {
      showToast({
        title: 'Could not create project',
        description: 'Something went wrong saving to this browser.',
        variant: 'error',
      });
    }
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
        <div className={styles.row}>
          <Input
            label="Designer"
            placeholder="Optional"
            error={errors.designer?.message}
            {...register('designer')}
          />
          <Input
            label="Version"
            placeholder="1.0"
            error={errors.version?.message}
            {...register('version')}
          />
        </div>
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
