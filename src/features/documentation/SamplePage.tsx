import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Badge, Button, ProgressBar } from '../../components/ui';
import { cn } from '../../utils/cn';
import { useCreateEditableSample } from '../../hooks/useCreateEditableSample';
import logo from '../../assets/devlens-logo.svg';
import styles from './SamplePage.module.css';
import {
  accessibilityNotes,
  changelog,
  components,
  developerQuestions,
  flows,
  interactions,
  overviewStats,
  pages,
  projectName,
  readinessBreakdown,
  responsiveNotes,
} from './sampleContent';

const sections = [
  'Overview',
  'Pages',
  'Flows',
  'Components',
  'Tokens',
  'Interactions',
  'Responsive',
  'Accessibility',
  'Developer questions',
  'Open questions',
  'Changelog',
] as const;

type Section = (typeof sections)[number];

const openQuestions = developerQuestions.filter((question) => question.status === 'open');

function OverviewSection() {
  return (
    <>
      <div className={styles.statsRow}>
        {overviewStats.map((stat) => (
          <div key={stat.label} className={styles.stat}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
      <p className={styles.docLabel}>Handoff readiness breakdown</p>
      <div className={styles.bars} style={{ marginTop: 'var(--space-4)' }}>
        {readinessBreakdown.map((item) => (
          <ProgressBar key={item.label} label={item.label} value={item.value} tone="success" />
        ))}
      </div>
    </>
  );
}

function PagesSection() {
  return (
    <div className={styles.list}>
      {pages.map((page) => (
        <div key={page.name} className={styles.listItem}>
          <div>
            <p className={styles.itemTitle}>{page.name}</p>
            <p className={styles.itemDescription}>{page.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function FlowsSection() {
  return (
    <div className={styles.list}>
      {flows.map((flow) => (
        <div key={flow.name} className={styles.listItem}>
          <div>
            <p className={styles.itemTitle}>{flow.name}</p>
            <ol className={styles.stepList}>
              {flow.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </div>
  );
}

function ComponentsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = components[activeIndex]!;

  return (
    <div className={styles.componentLayout}>
      <div className={styles.componentList}>
        {components.map((component, index) => (
          <button
            key={component.name}
            type="button"
            className={cn(
              styles.componentListItem,
              index === activeIndex && styles.componentListItemActive,
            )}
            onClick={() => setActiveIndex(index)}
          >
            {component.name}
          </button>
        ))}
      </div>
      <div>
        <h3 className={styles.itemTitle} style={{ fontSize: 'var(--font-size-h3)' }}>
          {active.name}
        </h3>
        <div className={styles.docSection}>
          <span className={styles.docLabel}>Purpose</span>
          <p className={styles.docBody}>{active.purpose}</p>
        </div>
        <div className={styles.docSection}>
          <span className={styles.docLabel}>Variants</span>
          <div className={styles.pillRow}>
            {active.variants.map((variant) => (
              <Badge key={variant} variant="neutral">
                {variant}
              </Badge>
            ))}
          </div>
        </div>
        <div className={styles.docSection}>
          <span className={styles.docLabel}>States</span>
          <div className={styles.pillRow}>
            {active.states.map((state) => (
              <Badge key={state} variant="neutral">
                {state}
              </Badge>
            ))}
          </div>
        </div>
        <div className={styles.docSection}>
          <span className={styles.docLabel}>Behaviour</span>
          <p className={styles.docBody}>{active.behaviour}</p>
        </div>
        <div className={styles.docSection}>
          <span className={styles.docLabel}>Accessibility</span>
          <p className={styles.docBody}>{active.accessibility}</p>
        </div>
        <div className={styles.docSection}>
          <span className={styles.docLabel}>Tokens</span>
          <div className={styles.pillRow}>
            {active.tokens.map((token) => (
              <code key={token} className={styles.tokenName}>
                {token}
              </code>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TokensSection() {
  const allTokens = Array.from(new Set(components.flatMap((component) => component.tokens)));

  return (
    <table className={styles.tokenTable}>
      <thead>
        <tr>
          <th>Token</th>
          <th>Used by</th>
        </tr>
      </thead>
      <tbody>
        {allTokens.map((token) => (
          <tr key={token}>
            <td className={styles.tokenName}>{token}</td>
            <td>
              {components
                .filter((component) => component.tokens.includes(token))
                .map((component) => component.name)
                .join(', ')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InteractionsSection() {
  return (
    <div className={styles.list}>
      {interactions.map((item) => (
        <div key={item.component + item.detail} className={styles.listItem}>
          <div>
            <p className={styles.itemTitle}>{item.component}</p>
            <p className={styles.itemDescription}>{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResponsiveSection() {
  return (
    <div className={styles.list}>
      {responsiveNotes.map((item) => (
        <div key={item.area} className={styles.listItem}>
          <div>
            <p className={styles.itemTitle}>{item.area}</p>
            <p className={styles.itemDescription}>{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AccessibilitySection() {
  return (
    <div className={styles.list}>
      {accessibilityNotes.map((note) => (
        <div key={note} className={styles.listItem}>
          <p className={styles.itemDescription} style={{ marginTop: 0 }}>
            {note}
          </p>
        </div>
      ))}
    </div>
  );
}

function DeveloperQuestionsSectionContent() {
  return (
    <div className={styles.list}>
      {developerQuestions.map((item) => (
        <div key={item.component + item.question} className={styles.questionRow}>
          <div>
            <p className={styles.itemTitle}>{item.component}</p>
            <p className={styles.itemDescription}>{item.question}</p>
            {item.answer && (
              <p className={styles.itemDescription} style={{ marginTop: 'var(--space-2)' }}>
                {item.answer}
              </p>
            )}
          </div>
          <Badge variant={item.status === 'answered' ? 'success' : 'warning'}>{item.status}</Badge>
        </div>
      ))}
    </div>
  );
}

function OpenQuestionsSection() {
  if (openQuestions.length === 0) {
    return <p className={styles.itemDescription}>No open questions remain.</p>;
  }

  return (
    <div className={styles.list}>
      {openQuestions.map((item) => (
        <div key={item.component + item.question} className={styles.questionRow}>
          <div>
            <p className={styles.itemTitle}>{item.component}</p>
            <p className={styles.itemDescription}>{item.question}</p>
          </div>
          <Badge variant="warning">Blocking</Badge>
        </div>
      ))}
    </div>
  );
}

function ChangelogSection() {
  return (
    <div>
      {changelog.map((item) => (
        <div key={item.date} className={styles.changelogItem}>
          <span className={styles.changelogDate}>{item.date}</span>
          <span className={styles.changelogEntry}>{item.entry}</span>
        </div>
      ))}
    </div>
  );
}

const sectionSubtitles: Record<Section, string> = {
  Overview: 'A summary of documentation completeness for this project.',
  Pages: 'Every page identified in the imported design.',
  Flows: 'Multi-step user journeys documented across pages.',
  Components: 'Structured documentation for each reusable component.',
  Tokens: 'Design tokens referenced by documented components.',
  Interactions: 'Behaviour captured beyond what a static frame can show.',
  Responsive: 'How the layout adapts across breakpoints.',
  Accessibility: 'Accessibility requirements captured during documentation.',
  'Developer questions': 'Questions raised during documentation, answered or still open.',
  'Open questions': 'Unresolved questions that currently block implementation.',
  Changelog: 'A history of documentation changes for this project.',
};

export function SamplePage() {
  const [activeSection, setActiveSection] = useState<Section>('Overview');
  const { createEditableSample, isCreating } = useCreateEditableSample();

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.brand}>
          <img src={logo} alt="" className={styles.mark} />
          <span className={styles.name}>
            Dev<span className={styles.accent}>Lens</span>
          </span>
        </Link>
        <Button size="sm" isLoading={isCreating} onClick={createEditableSample}>
          Create editable copy
        </Button>
      </div>

      <div className={styles.banner} role="status">
        <Eye size={16} className={styles.bannerIcon} aria-hidden="true" />
        <div>
          <span className={styles.bannerLabel}>Sample project · Read only</span>
          <p className={styles.bannerText}>
            This example demonstrates how a completed DevLens handoff can look.
          </p>
        </div>
      </div>

      <div className={styles.body}>
        <nav className={styles.sidebar} aria-label="Sample documentation sections">
          <span className={styles.projectName}>{projectName}</span>
          {sections.map((section) => (
            <button
              key={section}
              type="button"
              className={cn(styles.navItem, section === activeSection && styles.navItemActive)}
              aria-current={section === activeSection ? 'true' : undefined}
              onClick={() => setActiveSection(section)}
            >
              {section}
              {section === 'Open questions' && (
                <span className={styles.navBadge}>{openQuestions.length}</span>
              )}
            </button>
          ))}
        </nav>

        <main className={styles.content}>
          <div className={styles.contentHeader}>
            <h1 className={styles.contentTitle}>{activeSection}</h1>
            <p className={styles.contentSubtitle}>{sectionSubtitles[activeSection]}</p>
          </div>

          {activeSection === 'Overview' && <OverviewSection />}
          {activeSection === 'Pages' && <PagesSection />}
          {activeSection === 'Flows' && <FlowsSection />}
          {activeSection === 'Components' && <ComponentsSection />}
          {activeSection === 'Tokens' && <TokensSection />}
          {activeSection === 'Interactions' && <InteractionsSection />}
          {activeSection === 'Responsive' && <ResponsiveSection />}
          {activeSection === 'Accessibility' && <AccessibilitySection />}
          {activeSection === 'Developer questions' && <DeveloperQuestionsSectionContent />}
          {activeSection === 'Open questions' && <OpenQuestionsSection />}
          {activeSection === 'Changelog' && <ChangelogSection />}
        </main>
      </div>
    </div>
  );
}
