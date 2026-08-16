import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Input, SaveStatusIndicator, Select, Skeleton, Textarea } from '../../components/ui';
import { useProject, useProjectStore } from '../../store/useProjectStore';
import type { InteractionEntry, OpenQuestion, PageDocumentation } from '../../domain/documentation';
import { createEmptyPageDoc } from '../../services/storage';
import { generateId } from '../../utils/id';
import { Section } from './Section';
import { RepeatableRowList, RepeatableTextList } from './editors';
import { useAutosaveDoc } from './useAutosaveDoc';
import styles from './PageDocumentationView.module.css';

const triggerOptions = [
  { label: 'Click', value: 'click' },
  { label: 'Hover', value: 'hover' },
  { label: 'Focus', value: 'focus' },
  { label: 'Drag', value: 'drag' },
  { label: 'Keypress', value: 'keypress' },
  { label: 'Load', value: 'load' },
];

const questionStatusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Answered', value: 'answered' },
];

export function PageDocumentationView() {
  const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>();
  const status = useProjectStore((state) => state.status);
  const project = useProject(projectId);
  const updatePageDoc = useProjectStore((state) => state.updatePageDoc);

  const page = project?.pages.find((candidate) => candidate.id === pageId);
  const storedDoc = project?.pageDocs.find((doc) => doc.pageId === pageId);
  const initialDoc = storedDoc ?? (pageId ? createEmptyPageDoc(pageId) : null);

  const [doc, setDoc] = useState<PageDocumentation | null>(initialDoc);
  const [trackedPageId, setTrackedPageId] = useState(pageId);

  // Re-seed local state when navigating to a different page. Safe to set
  // state during render here: https://react.dev/learn/you-might-not-need-an-effect
  if (pageId !== trackedPageId) {
    setTrackedPageId(pageId);
    setDoc(initialDoc);
  }

  const saveStatus = useAutosaveDoc(doc, pageId ?? '', async (value) => {
    if (!projectId || !pageId || !value) return;
    await updatePageDoc(projectId, pageId, value);
  });

  if (!projectId || !pageId) {
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

  if (!project || !page || !doc) {
    return (
      <div className={styles.page}>
        <p>Page not found.</p>
        <Link to={`/projects/${projectId}`} className={styles.breadcrumb}>
          ← Back to {project?.name ?? 'project'}
        </Link>
      </div>
    );
  }

  const update = (patch: Partial<PageDocumentation>) => {
    setDoc((current) => (current ? { ...current, ...patch } : current));
  };

  return (
    <div className={styles.page}>
      <Link to={`/projects/${projectId}`} className={styles.breadcrumb}>
        ← {project.name}
      </Link>
      <div className={styles.header}>
        <h1 className={styles.title}>{page.name}</h1>
        <SaveStatusIndicator status={saveStatus} />
      </div>

      <Section title="Overview">
        <Textarea
          label="Overview"
          hideLabel
          placeholder="A brief summary of this page."
          value={doc.overview}
          onChange={(event) => update({ overview: event.target.value })}
        />
      </Section>

      <Section title="Purpose">
        <Textarea
          label="Purpose"
          hideLabel
          placeholder="What is this page for?"
          value={doc.purpose}
          onChange={(event) => update({ purpose: event.target.value })}
        />
      </Section>

      <Section title="User goal">
        <Textarea
          label="User goal"
          hideLabel
          placeholder="What is the user trying to accomplish here?"
          value={doc.userGoal}
          onChange={(event) => update({ userGoal: event.target.value })}
        />
      </Section>

      <Section title="Description">
        <Textarea
          label="Description"
          hideLabel
          placeholder="Describe what's on this page in more detail."
          value={doc.description}
          onChange={(event) => update({ description: event.target.value })}
        />
      </Section>

      <Section title="Layout">
        <Textarea
          label="Layout"
          hideLabel
          placeholder="Describe the page's layout approach."
          value={doc.layout}
          onChange={(event) => update({ layout: event.target.value })}
        />
      </Section>

      <Section title="Responsive behaviour">
        <RepeatableRowList
          label="Responsive behaviour"
          items={doc.responsive}
          onChange={(responsive) => update({ responsive })}
          createItem={() => ({ id: generateId(), breakpoint: '', description: '' })}
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

      <Section title="Interactions">
        <RepeatableRowList
          label="Interactions"
          items={doc.interactions}
          onChange={(interactions) => update({ interactions })}
          createItem={(): InteractionEntry => ({
            id: generateId(),
            trigger: 'click',
            description: '',
          })}
          addLabel="Add interaction"
          emptyLabel="No interactions documented yet."
          renderRow={(item, rowUpdate, index) => (
            <>
              <Select
                label={`Trigger ${index + 1}`}
                hideLabel
                options={triggerOptions}
                value={item.trigger}
                onValueChange={(value) =>
                  rowUpdate({
                    trigger: value as PageDocumentation['interactions'][number]['trigger'],
                  })
                }
              />
              <Input
                label={`Interaction description ${index + 1}`}
                hideLabel
                placeholder="What happens?"
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
                onValueChange={(value) =>
                  rowUpdate({
                    status: value as PageDocumentation['openQuestions'][number]['status'],
                  })
                }
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
