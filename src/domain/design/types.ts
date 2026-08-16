/**
 * Design-source entities extracted from an imported Figma file.
 * Interfaces only — no parsing or extraction logic yet.
 */

export type ComponentKind = 'frame' | 'group' | 'text' | 'instance' | 'shape' | 'unknown';

export interface DesignComponent {
  id: string;
  pageId: string;
  parentId?: string;
  name: string;
  kind: ComponentKind;
  boundingBox: BoundingBox;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type TokenKind = 'color' | 'typography' | 'spacing' | 'radius' | 'shadow' | 'other';

export interface DesignToken {
  id: string;
  projectId: string;
  name: string;
  kind: TokenKind;
  value: string;
}

export type InteractionTrigger = 'click' | 'hover' | 'drag' | 'keypress' | 'load' | 'unknown';

export interface Interaction {
  id: string;
  componentId: string;
  trigger: InteractionTrigger;
  description?: string;
}
