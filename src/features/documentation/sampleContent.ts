/**
 * Static content for the read-only /sample reader.
 * FinEdge Banking Dashboard is a fictional project used purely to
 * demonstrate what a completed DevLens handoff can look like.
 */

export const projectName = 'FinEdge Banking Dashboard';

export const overviewStats = [
  { label: 'Pages', value: '6' },
  { label: 'Components', value: '24' },
  { label: 'Open questions', value: '3' },
  { label: 'Readiness', value: '92%' },
];

export const readinessBreakdown = [
  { label: 'Components', value: 96 },
  { label: 'States', value: 90 },
  { label: 'Interactions', value: 91 },
  { label: 'Responsive', value: 94 },
  { label: 'Accessibility', value: 89 },
  { label: 'Tokens', value: 98 },
];

export const pages = [
  { name: 'Account overview', description: 'Balance summary, recent activity, and quick actions.' },
  { name: 'Transactions', description: 'Filterable, searchable ledger of all account activity.' },
  { name: 'Transfer money', description: 'Move funds between accounts or to a saved payee.' },
  { name: 'Cards', description: 'View, freeze, and manage physical and virtual cards.' },
  { name: 'Statements', description: 'Monthly statement archive with PDF download.' },
  { name: 'Settings', description: 'Notification preferences, security, and linked accounts.' },
];

export const flows = [
  {
    name: 'New transfer',
    steps: [
      'Select source and destination',
      'Enter amount',
      'Review',
      'Confirm with device passcode',
    ],
  },
  {
    name: 'Dispute a transaction',
    steps: [
      'Select transaction',
      'Choose a reason',
      'Attach evidence (optional)',
      'Submit and track status',
    ],
  },
  {
    name: 'Freeze a card',
    steps: ['Select card', 'Confirm freeze', 'Card shows frozen state everywhere it appears'],
  },
];

export interface ComponentDoc {
  name: string;
  purpose: string;
  variants: string[];
  states: string[];
  behaviour: string;
  accessibility: string;
  tokens: string[];
}

export const components: ComponentDoc[] = [
  {
    name: 'Balance card',
    purpose: 'Shows the current balance for a single account on the overview page.',
    variants: ['Checking', 'Savings', 'Credit'],
    states: ['Default', 'Loading', 'Balance hidden'],
    behaviour: 'Tapping the eye icon toggles balance visibility for the session only.',
    accessibility: 'Balance changes are announced via an aria-live polite region.',
    tokens: ['color.balance-positive', 'color.balance-negative', 'radius.card'],
  },
  {
    name: 'Transaction row',
    purpose: 'A single line item in the transaction ledger.',
    variants: ['Debit', 'Credit', 'Pending'],
    states: ['Default', 'Hover', 'Selected', 'Disputed'],
    behaviour: 'Pending transactions are visually distinct and cannot be disputed until settled.',
    accessibility: 'Amount sign is conveyed with a label, not colour alone.',
    tokens: ['color.text-muted', 'spacing.row-y', 'font.mono-amount'],
  },
  {
    name: 'Transfer form',
    purpose: 'Collects source, destination and amount for a money transfer.',
    variants: ['Internal transfer', 'External payee'],
    states: ['Default', 'Validating', 'Error', 'Submitting'],
    behaviour: 'Submitting state disables all fields and prevents duplicate submission.',
    accessibility: 'Validation errors are associated with fields via aria-describedby.',
    tokens: ['action.primary', 'color.error', 'radius.medium'],
  },
];

export const interactions = [
  {
    component: 'Transfer form',
    detail:
      'Submit button shows a loading spinner and disables all inputs while the transfer is processing.',
  },
  {
    component: 'Balance card',
    detail: 'Long-pressing the balance figure copies the amount to the clipboard.',
  },
  {
    component: 'Card freeze toggle',
    detail: 'Toggling requires a confirmation dialog before the frozen state takes effect.',
  },
  {
    component: 'Transaction row',
    detail: 'Swiping left on mobile reveals a "Dispute" shortcut action.',
  },
];

export const responsiveNotes = [
  {
    area: 'Transaction table',
    detail: 'Collapses from a table to stacked cards below 768px.',
  },
  {
    area: 'Navigation',
    detail: 'Sidebar becomes a bottom tab bar below 640px.',
  },
  {
    area: 'Transfer form',
    detail:
      'Source and destination fields stack vertically below 480px instead of sitting side by side.',
  },
];

export const accessibilityNotes = [
  'All balance and transaction amount changes are announced through an aria-live region.',
  'Colour is never the only indicator for positive, negative, or pending transaction states.',
  'The card freeze toggle exposes its state through an accessible name, not just a visual switch.',
  'All interactive elements are reachable and operable via keyboard alone.',
];

export interface DeveloperQuestion {
  component: string;
  question: string;
  answer?: string;
  status: 'open' | 'answered';
}

export const developerQuestions: DeveloperQuestion[] = [
  {
    component: 'Transfer form',
    question:
      'Does the price — sorry, the transfer amount — update optimistically before the server confirms?',
    answer:
      'No. The transfer amount is only confirmed after the server responds; the UI shows a pending state until then.',
    status: 'answered',
  },
  {
    component: 'Transaction row',
    question: 'What happens if a dispute is submitted while offline?',
    status: 'open',
  },
  {
    component: 'Card freeze toggle',
    question: 'Is there a limit to how many times a card can be frozen and unfrozen per day?',
    status: 'open',
  },
  {
    component: 'Balance card',
    question: 'Should the hidden-balance preference persist across sessions?',
    status: 'open',
  },
  {
    component: 'Statements',
    question: 'What format is the downloaded statement — PDF only, or also CSV?',
    answer: 'PDF only for this release. CSV export is out of scope.',
    status: 'answered',
  },
];

export const changelog = [
  { date: '2026-08-10', entry: 'Documented transfer confirmation states and error handling.' },
  {
    date: '2026-08-05',
    entry: 'Added accessibility notes for the balance card and transaction row.',
  },
  { date: '2026-07-28', entry: 'Initial import from Figma. Pages and components indexed.' },
];
