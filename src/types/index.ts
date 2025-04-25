// types.ts
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
