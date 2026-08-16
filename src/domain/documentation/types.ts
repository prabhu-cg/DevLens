/**
 * Structured documentation content for a page or component within a
 * project's workspace. Persisted inline on the Project record.
 */

export type DocStatus = 'not_started' | 'in_progress' | 'documented';

export type QuestionStatus = 'open' | 'answered';

export interface OpenQuestion {
  id: string;
  question: string;
  status: QuestionStatus;
  answer?: string;
}

export type InteractionTrigger = 'click' | 'hover' | 'focus' | 'drag' | 'keypress' | 'load';

export interface InteractionEntry {
  id: string;
  trigger: InteractionTrigger;
  description: string;
}

export interface ResponsiveNote {
  id: string;
  breakpoint: string;
  description: string;
}

export type ComponentPropertyType = 'string' | 'number' | 'boolean' | 'enum';

export interface ComponentProperty {
  id: string;
  name: string;
  type: ComponentPropertyType;
  required: boolean;
  description?: string;
}

export interface ComponentState {
  id: string;
  name: string;
  description?: string;
}

export interface PageDocumentation {
  pageId: string;
  status: DocStatus;
  overview: string;
  purpose: string;
  userGoal: string;
  description: string;
  layout: string;
  responsive: ResponsiveNote[];
  interactions: InteractionEntry[];
  accessibility: string[];
  implementationNotes: string;
  openQuestions: OpenQuestion[];
  updatedAt: string;
}

export interface ComponentDocumentation {
  id: string;
  name: string;
  status: DocStatus;
  overview: string;
  purpose: string;
  description: string;
  anatomy: string[];
  variants: string[];
  properties: ComponentProperty[];
  states: ComponentState[];
  usage: string;
  behaviour: string;
  responsive: ResponsiveNote[];
  accessibility: string[];
  tokens: string[];
  implementationNotes: string;
  openQuestions: OpenQuestion[];
  createdAt: string;
  updatedAt: string;
}
