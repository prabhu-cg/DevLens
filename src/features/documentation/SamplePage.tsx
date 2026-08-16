import { Badge, Card, Tabs } from '../../components/ui';
import type { Documentation, DeveloperQuestion } from '../../domain/documentation';
import type { AuditIssue } from '../../domain/audit';
import styles from './SamplePage.module.css';

const sampleDocumentation: Documentation[] = [
  {
    id: 'doc-1',
    projectId: 'sample',
    title: 'Cart quantity stepper',
    intent:
      'The stepper should disable the decrement control at a quantity of 1 rather than allowing removal — removal happens through the trash icon, not by stepping to zero.',
    status: 'resolved',
    createdAt: '2026-08-01T09:00:00.000Z',
    updatedAt: '2026-08-03T14:00:00.000Z',
  },
  {
    id: 'doc-2',
    projectId: 'sample',
    title: 'Empty search results',
    intent:
      'Show the empty state after the search debounce completes, not while results are still loading — avoids a flash of "no results" on fast typers.',
    status: 'in_review',
    createdAt: '2026-08-02T09:00:00.000Z',
    updatedAt: '2026-08-04T11:00:00.000Z',
  },
];

const sampleQuestions: DeveloperQuestion[] = [
  {
    id: 'q-1',
    projectId: 'sample',
    question: 'Does the price update optimistically before the server confirms the new quantity?',
    answer: 'Yes — update immediately, then reconcile if the server response differs.',
    status: 'answered',
    createdAt: '2026-08-02T10:00:00.000Z',
    updatedAt: '2026-08-02T15:00:00.000Z',
  },
  {
    id: 'q-2',
    projectId: 'sample',
    question: 'What happens if a user searches while offline?',
    status: 'open',
    createdAt: '2026-08-05T09:00:00.000Z',
    updatedAt: '2026-08-05T09:00:00.000Z',
  },
];

const sampleAuditIssues: AuditIssue[] = [
  {
    id: 'issue-1',
    projectId: 'sample',
    category: 'ambiguity',
    severity: 'medium',
    status: 'open',
    summary: 'Hover state for the cart line item has no defined behaviour on touch devices.',
    createdAt: '2026-08-05T09:00:00.000Z',
    updatedAt: '2026-08-05T09:00:00.000Z',
  },
  {
    id: 'issue-2',
    projectId: 'sample',
    category: 'missing_token',
    severity: 'low',
    status: 'acknowledged',
    summary: 'Border radius on the promo banner does not match an existing token.',
    createdAt: '2026-08-05T09:00:00.000Z',
    updatedAt: '2026-08-05T09:00:00.000Z',
  },
];

function DocumentationTab() {
  return (
    <div className={styles.section}>
      {sampleDocumentation.map((doc) => (
        <Card key={doc.id} style={{ marginBottom: 'var(--space-4)' }}>
          <div className={styles.sectionTitle}>{doc.title}</div>
          <p className={styles.sectionBody}>{doc.intent}</p>
          <Badge variant={doc.status === 'resolved' ? 'success' : 'warning'}>
            {doc.status.replace('_', ' ')}
          </Badge>
        </Card>
      ))}
    </div>
  );
}

function QuestionsTab() {
  return (
    <Card>
      <ul className={styles.questionList}>
        {sampleQuestions.map((question) => (
          <li key={question.id} className={styles.question}>
            <div>
              <p className={styles.questionText}>{question.question}</p>
              {question.answer && <p className={styles.sectionBody}>{question.answer}</p>}
            </div>
            <Badge variant={question.status === 'answered' ? 'success' : 'neutral'}>
              {question.status}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function AuditTab() {
  return (
    <Card>
      <ul className={styles.questionList}>
        {sampleAuditIssues.map((issue) => (
          <li key={issue.id} className={styles.question}>
            <p className={styles.questionText}>{issue.summary}</p>
            <Badge variant={issue.severity === 'medium' ? 'warning' : 'neutral'}>
              {issue.severity}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function SamplePage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Badge variant="brand" className={styles.badge}>
          Read-only sample
        </Badge>
        <h1 className={styles.title}>Checkout flow — handoff documentation</h1>
        <p className={styles.subtitle}>
          A worked example of what DevLens produces once a project has been documented and audited.
          This project cannot be edited.
        </p>
      </div>
      <Tabs
        label="Sample documentation sections"
        items={[
          { value: 'documentation', label: 'Documentation', content: <DocumentationTab /> },
          { value: 'questions', label: 'Developer questions', content: <QuestionsTab /> },
          { value: 'audit', label: 'Audit issues', content: <AuditTab /> },
        ]}
      />
    </div>
  );
}
