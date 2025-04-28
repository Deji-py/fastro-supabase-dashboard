// types.ts

import type { MRT_ColumnDef, MRT_RowSelectionState } from "mantine-react-table";
import { ReactNode, ComponentType } from "react";

export type sidebarPosType = "left" | "right";

// Modify layout type to remove variant from header
export type FASTRO_APP_LAYOUT = {
  header: {
    section: ComponentType<{ children: ReactNode }>; // Expecting a component that accepts children
    children?: ReactNode;
  };
  footer?: {
    section: ComponentType<{ children: ReactNode }>;
    children?: ReactNode;
  };
  sidebar?:
    | [
        {
          section: ComponentType<{
            children: ReactNode;
            position: sidebarPosType;
          }>;
          children?: ReactNode;
          position: "left";
        },
        {
          section: ComponentType<{
            children: ReactNode;
            position: sidebarPosType;
          }>;
          children?: ReactNode;
          position: "right";
        }
      ]
    | [
        {
          section: ComponentType<{
            children: ReactNode;
            position: sidebarPosType;
          }>;
          children?: ReactNode;
          position: "left";
        }
      ];
};

// types.ts
export type User = {
  id: string;
  firstname: string;
  lastname: string;
  companyName: string;
  email: string;
  sector: string;
};

// Types
export type QueryFilters = {
  eq?: Record<string, any>;
  neq?: Record<string, any>;
  gt?: Record<string, any>;
  gte?: Record<string, any>;
  lt?: Record<string, any>;
  lte?: Record<string, any>;
  like?: Record<string, any>;
  ilike?: Record<string, any>;
  in?: Record<string, any[]>;
  contains?: Record<string, any>;
  containedBy?: Record<string, any>;
  rangeGt?: Record<string, any>;
  rangeGte?: Record<string, any>;
  rangeLt?: Record<string, any>;
  rangeLte?: Record<string, any>;
  textSearch?: Record<string, any>;
  match?: Record<string, any>;
};

export type QueryOptions = {
  select?: string;
  order?: { column: string; ascending?: boolean }[];
  limit?: number;
  offset?: number;
  filters?: QueryFilters;
  single?: boolean;
  count?: "exact" | "planned" | "estimated";
  head?: boolean;
  maybeSingle?: boolean;
  enabled?: boolean;
};

export type MutationOptions = {
  returning?: string;
  onConflict?: string;
  ignoreDuplicates?: boolean;
  upsert?: boolean;
};

export type FetchTableParams = {
  table: string;
  options?: QueryOptions;
};

export type FetchByIdParams = {
  table: string;
  id: string | number;
  options?: Omit<QueryOptions, "filters" | "single">;
};

export type CreateParams<T> = {
  table: string;
  data: Partial<T>;
  options?: MutationOptions;
};

export type UpdateParams<T> = {
  table: string;
  id: string | number;
  data: Partial<T>;
  options?: MutationOptions;
};

export type DeleteParams = {
  table: string;
  id: string | number;
  options?: Pick<MutationOptions, "returning">;
};

export type BulkCreateParams<T> = {
  table: string;
  data: Partial<T>[];
  options?: MutationOptions;
};

export type BulkUpdateParams<T> = {
  table: string;
  data: Partial<T>;
  filters: QueryFilters;
  options?: MutationOptions;
};

export type BulkDeleteParams = {
  table: string;
  filters: QueryFilters;
  options?: Pick<MutationOptions, "returning">;
};

export type UploadFileParams = {
  bucket: string;
  path: string;
  file: File;
  options?: {
    upsert?: boolean;
    contentType?: string;
  };
};

export type GetPublicUrlParams = {
  bucket: string;
  path: string;
};

export type RpcParams = {
  fn: string;
  params?: Record<string, any>;
};

export type ColumnVariantMap<T> = Record<
  keyof T,
  {
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
  }
>;

export type CustomActionProps<T> = {
  selectedRows: T[];
  onActionComplete?: () => void;
};

export type CustomPreviewProps<T> = {
  data: T;
  onClose: () => void;
};

export type BulkAction<T> = {
  label: string;
  icon: ReactNode;
  onClick: (rows: T[]) => void;
  color?: string;
};

export interface FastroTableProps<T extends object> {
  tableData: T[];
  columnVariants: ColumnVariantMap<T>;
  title?: string;
  enableCreate?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  enableRowSelection?: boolean;
  enableFiltering?: boolean;
  enableColumnOrdering?: boolean;
  enablePagination?: boolean;
  enablePreview?: boolean;
  enableCSVImport?: boolean;
  onRowCreate?: (data: T) => Promise<void> | void;
  onRowUpdate?: (newData: T, oldData: T) => Promise<void> | void;
  onRowDelete?: (data: T) => Promise<void> | void;
  onBulkDelete?: (data: T[]) => Promise<void> | void;
  onCSVImport?: (
    file: File,
    useBatchProcessing: boolean
  ) => Promise<void> | void;
  onSelectionChange?: (rows: T[]) => void;
  bulkActions?: BulkAction<T>[];
  customActions?: ReactNode | ((props: CustomActionProps<T>) => ReactNode);
  customPreview?: ReactNode | ((props: CustomPreviewProps<T>) => ReactNode);
  dropdownOptions?: Array<{
    field: string;
    options: Array<{ value: string; label: string }>;
  }>;
  emptyState?: React.ReactNode;
  editableColumns?: (keyof T)[];
  createTemplate?: Partial<T>;
  rowsPerPage?: number;
  maxHeight?: string | number;
  previewExcludeFields?: (keyof T)[];
  previewLabelMap?: Partial<Record<keyof T, string>>;
}

export interface TableActionProps<T extends object>
  extends FastroTableProps<T> {
  setIsCreateModalOpen: (isOpen: boolean) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setIsPreviewModalOpen: (isOpen: boolean) => void;
  setCurrentRow: (row: T | null) => void;
  setSelectedRows: (rows: T[]) => void;
  setRowSelection: (selection: MRT_RowSelectionState) => void;
}

export interface TableOptionsProps<T extends object>
  extends FastroTableProps<T> {
  columns: MRT_ColumnDef<T>[];
  rowSelection: MRT_RowSelectionState;
  setRowSelection: (selection: MRT_RowSelectionState) => void;
  selectedRows: T[];
  currentRow: T | null;
  setIsCreateModalOpen: (isOpen: boolean) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setCurrentRow: (row: T | null) => void;
  handleDeleteRow: (row: T) => Promise<void>;
  handleBulkDelete: (rows: T[]) => Promise<void>;
  openPreviewModal: (row: T) => void;
  clearSelection: () => void;
}

export interface ModalProps<T extends object> {
  isOpen: boolean;
  onClose: () => void;
  columnVariants: ColumnVariantMap<T>;
  dropdownOptions: Array<{
    field: string;
    options: Array<{ value: string; label: string }>;
  }>;
}

export interface CreateModalProps<T extends object> extends ModalProps<T> {
  onSubmit: (values: any) => Promise<void>;
  createTemplate?: Partial<T>;
}

export interface EditModalProps<T extends object> extends ModalProps<T> {
  currentRow: T | null;
  onSubmit: (values: any, currentRow: any) => Promise<void>;
}

export interface PreviewModalProps<T extends object> {
  isOpen: boolean;
  onClose: () => void;
  currentRow: T | null;
  customPreview?: ReactNode | ((props: CustomPreviewProps<T>) => ReactNode);
  columnVariants: ColumnVariantMap<T>;
  previewExcludeFields?: (keyof T)[];
  previewLabelMap?: Partial<Record<keyof T, string>>;
}

export interface CSVImportModalProps {
  opened: boolean;
  onClose: () => void;
  onImportSuccess: (data: any) => void;
  onCSVImport?: (
    file: File,
    useBatchProcessing: boolean
  ) => Promise<void> | void;
}
