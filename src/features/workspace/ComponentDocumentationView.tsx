import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Input, SaveStatusIndicator, Select, Skeleton, Textarea } from '../../components/ui';
import { useProject, useProjectStore } from '../../store/useProjectStore';
import type {
  ComponentDocumentation,
  ComponentProperty,
  ComponentState,
  OpenQuestion,
  ResponsiveNote,
} from '../../domain/documentation';
import { generateId } from '../../utils/id';
import { Section } from './Section';
import { RepeatableRowList, RepeatableTextList } from './editors';
import { useAutosaveDoc } from './useAutosaveDoc';
import styles from './ComponentDocumentationView.module.css';

const propertyTypeOptions = [
  { label: 'String', value: 'string' },
  { label: 'Number', value: 'number' },
  { label: 'Boolean', value: 'boolean' },
  { label: 'Enum', value: 'enum' },
];

const requiredOptions = [
  { label: 'Optional', value: 'false' },
  { label: 'Required', value: 'true' },
];

const questionStatusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Answered', value: 'answered' },
];

export function ComponentDocumentationView() {
  const { projectId, componentId } = useParams<{ projectId: string; componentId: string }>();
  const status = useProjectStore((state) => state.status);
  const project = useProject(projectId);
  const updateComponentDoc = useProjectStore((state) => state.updateComponentDoc);

  const storedDoc = project?.components.find((component) => component.id === componentId);

  const [doc, setDoc] = useState<ComponentDocumentation | null>(storedDoc ?? null);
  const [trackedComponentId, setTrackedComponentId] = useState(componentId);

  // Re-seed local state when navigating to a different component. Safe to
  // set state during render here: https://react.dev/learn/you-might-not-need-an-effect
  if (componentId !== trackedComponentId) {
    setTrackedComponentId(componentId);
    setDoc(storedDoc ?? null);
  }

  const saveStatus = useAutosaveDoc(doc, componentId ?? '', async (value) => {
    if (!projectId || !componentId || !value) return;
    await updateComponentDoc(projectId, componentId, value);
  });

  if (!projectId || !componentId) {
    return <Navigate to="/projects" replace />;
  }

  if (status !== 'ready' && !project) {
    return (
      <div className={styles.page}>
        <Skeleton width="30%" height={16} />
        <div style={{ marginTop: 'var(--space-4)' }}>
          <Skeleton width="50%" height={36} />
        </div>
      </div>
    );
  }

  if (!project || !doc) {
    return (
      <div className={styles.page}>
        <p>Component not found.</p>
        <Link to={`/projects/${projectId}`} className={styles.breadcrumb}>
          ← Back to {project?.name ?? 'project'}
        </Link>
      </div>
    );
  }

  const update = (patch: Partial<ComponentDocumentation>) => {
    setDoc((current) => (current ? { ...current, ...patch } : current));
  };

  return (
    <div className={styles.page}>
      <Link to={`/projects/${projectId}`} className={styles.breadcrumb}>
        ← {project.name}
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>{doc.name}</h1>
        <SaveStatusIndicator status={saveStatus} />
      </div>

      <Section title="Overview">
        <Textarea
          label="Overview"
          hideLabel
          placeholder="A brief summary of this component."
          value={doc.overview}
          onChange={(event) => update({ overview: event.target.value })}
        />
      </Section>

      <Section title="Purpose">
        <Textarea
          label="Purpose"
          hideLabel
          placeholder="What is this component for?"
          value={doc.purpose}
          onChange={(event) => update({ purpose: event.target.value })}
        />
      </Section>

      <Section title="Description">
        <Textarea
          label="Description"
          hideLabel
          placeholder="Describe the component in more detail."
          value={doc.description}
          onChange={(event) => update({ description: event.target.value })}
        />
      </Section>

      <Section title="Anatomy">
        <RepeatableTextList
          label="Anatomy"
          items={doc.anatomy}
          onChange={(anatomy) => update({ anatomy })}
          placeholder="e.g. Label"
          addLabel="Add part"
          emptyLabel="No anatomy documented yet."
        />
      </Section>

      <Section title="Variants">
        <RepeatableTextList
          label="Variants"
          items={doc.variants}
          onChange={(variants) => update({ variants })}
          placeholder="e.g. Primary"
          addLabel="Add variant"
          emptyLabel="No variants documented yet."
        />
      </Section>

      <Section title="Properties">
        <RepeatableRowList
          label="Properties"
          items={doc.properties}
          onChange={(properties) => update({ properties })}
          createItem={(): ComponentProperty => ({
            id: generateId(),
            name: '',
            type: 'string',
            required: false,
          })}
          addLabel="Add property"
          emptyLabel="No properties documented yet."
          renderRow={(item, rowUpdate, index) => (
            <>
              <Input
                label={`Property name ${index + 1}`}
                hideLabel
                placeholder="e.g. variant"
                value={item.name}
                onChange={(event) => rowUpdate({ name: event.target.value })}
              />
              <Select
                label={`Property type ${index + 1}`}
                hideLabel
                options={propertyTypeOptions}
                value={item.type}
                onValueChange={(value) => rowUpdate({ type: value as ComponentProperty['type'] })}
              />
              <Select
                label={`Property required ${index + 1}`}
                hideLabel
                options={requiredOptions}
                value={String(item.required)}
                onValueChange={(value) => rowUpdate({ required: value === 'true' })}
              />
              <Input
                label={`Property description ${index + 1}`}
                hideLabel
                placeholder="What does this property control?"
                value={item.description ?? ''}
                onChange={(event) => rowUpdate({ description: event.target.value })}
              />
            </>
          )}
        />
      </Section>

      <Section title="States">
        <RepeatableRowList
          label="States"
          items={doc.states}
          onChange={(states) => update({ states })}
          createItem={(): ComponentState => ({ id: generateId(), name: '' })}
          addLabel="Add state"
          emptyLabel="No states documented yet."
          renderRow={(item, rowUpdate, index) => (
            <>
              <Input
                label={`State name ${index + 1}`}
                hideLabel
                placeholder="e.g. Loading"
                value={item.name}
                onChange={(event) => rowUpdate({ name: event.target.value })}
              />
              <Input
                label={`State description ${index + 1}`}
                hideLabel
                placeholder="What does this state look like or do?"
                value={item.description ?? ''}
                onChange={(event) => rowUpdate({ description: event.target.value })}
              />
            </>
          )}
        />
      </Section>

      <Section title="Usage">
        <Textarea
          label="Usage"
          hideLabel
          placeholder="When and how should this component be used?"
          value={doc.usage}
          onChange={(event) => update({ usage: event.target.value })}
        />
      </Section>

      <Section title="Behaviour">
        <Textarea
          label="Behaviour"
          hideLabel
          placeholder="How does this component behave?"
          value={doc.behaviour}
          onChange={(event) => update({ behaviour: event.target.value })}
        />
      </Section>

      <Section title="Responsive">
        <RepeatableRowList
          label="Responsive"
          items={doc.responsive}
          onChange={(responsive) => update({ responsive })}
          createItem={(): ResponsiveNote => ({ id: generateId(), breakpoint: '', description: '' })}
          addLabel="Add responsive note"
          emptyLabel="No responsive behaviour documented yet."
          renderRow={(item, rowUpdate, index) => (
            <>
              <Input
                label={`Breakpoint ${index + 1}`}
                hideLabel
                placeholder="e.g. Mobile"
                value={item.breakpoint}
                onChange={(event) => rowUpdate({ breakpoint: event.target.value })}
              />
              <Input
                label={`Responsive description ${index + 1}`}
                hideLabel
                placeholder="What changes at this breakpoint?"
                value={item.description}
                onChange={(event) => rowUpdate({ description: event.target.value })}
              />
            </>
          )}
        />
      </Section>

      <Section title="Accessibility">
        <RepeatableTextList
          label="Accessibility"
          items={doc.accessibility}
          onChange={(accessibility) => update({ accessibility })}
          placeholder="An accessibility requirement or note"
          addLabel="Add note"
          emptyLabel="No accessibility notes yet."
        />
      </Section>

      <Section title="Tokens">
        <RepeatableTextList
          label="Tokens"
          items={doc.tokens}
          onChange={(tokens) => update({ tokens })}
          placeholder="e.g. action.primary"
          addLabel="Add token"
          emptyLabel="No tokens documented yet."
        />
      </Section>

      <Section title="Implementation notes">
        <Textarea
          label="Implementation notes"
          hideLabel
          placeholder="Anything a developer should know when building this."
          value={doc.implementationNotes}
          onChange={(event) => update({ implementationNotes: event.target.value })}
        />
      </Section>

      <Section title="Open questions">
        <RepeatableRowList
          label="Open questions"
          items={doc.openQuestions}
          onChange={(openQuestions) => update({ openQuestions })}
          createItem={(): OpenQuestion => ({ id: generateId(), question: '', status: 'open' })}
          addLabel="Add question"
          emptyLabel="No open questions."
          renderRow={(item, rowUpdate, index) => (
            <>
              <Input
                label={`Question ${index + 1}`}
                hideLabel
                placeholder="What needs an answer?"
                value={item.question}
                onChange={(event) => rowUpdate({ question: event.target.value })}
              />
              <Select
                label={`Question status ${index + 1}`}
                hideLabel
                options={questionStatusOptions}
                value={item.status}
                onValueChange={(value) => rowUpdate({ status: value as OpenQuestion['status'] })}
              />
              {item.status === 'answered' && (
                <Input
                  label={`Answer ${index + 1}`}
                  hideLabel
                  placeholder="The answer"
                  value={item.answer ?? ''}
                  onChange={(event) => rowUpdate({ answer: event.target.value })}
                />
              )}
            </>
          )}
        />
      </Section>
    </div>
  );
}
