/**
 * Documentation and developer-question entities.
 * Interfaces only — the documentation engine is a later phase.
 */

export type DocumentationStatus = 'draft' | 'in_review' | 'resolved';

export interface Documentation {
  id: string;
  projectId: string;
  componentId?: string;
  title: string;
  intent: string;
  status: DocumentationStatus;
  createdAt: string;
  updatedAt: string;
}

export type DeveloperQuestionStatus = 'open' | 'answered' | 'dismissed';

export interface DeveloperQuestion {
  id: string;
  projectId: string;
  documentationId?: string;
  componentId?: string;
  question: string;
  answer?: string;
  status: DeveloperQuestionStatus;
  createdAt: string;
  updatedAt: string;
}
