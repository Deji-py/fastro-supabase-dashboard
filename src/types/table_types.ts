import type { ReactNode } from "react";

export type CellVariant = {
  type: string;
  variant?: string;
  label?: string;
  format?: (value: any) => string;
  editable?: boolean;
  hidden?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
};

export type BulkAction<T> = {
  label: string;
  icon: ReactNode;
  onClick: (rows: T[]) => void;
  color?: string;
};
