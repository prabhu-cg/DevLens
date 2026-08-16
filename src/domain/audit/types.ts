/**
 * Handoff-audit entities.
 * Interfaces only — the audit engine and readiness scoring are later phases.
 */

export type AuditIssueSeverity = 'low' | 'medium' | 'high' | 'critical';

export type AuditIssueCategory =
  | 'ambiguity'
  | 'missing_token'
  | 'missing_interaction'
  | 'inconsistency'
  | 'accessibility'
  | 'other';

export type AuditIssueStatus = 'open' | 'acknowledged' | 'resolved';

export interface AuditIssue {
  id: string;
  projectId: string;
  componentId?: string;
  category: AuditIssueCategory;
  severity: AuditIssueSeverity;
  status: AuditIssueStatus;
  summary: string;
  detail?: string;
  createdAt: string;
  updatedAt: string;
}
