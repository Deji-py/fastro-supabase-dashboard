import { queryClient } from "@/lib/Fastro";
import { supabaseApi } from "@/services/api/supabase/data";
import { MutationOptions, QueryFilters, QueryOptions } from "@/types";
import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationResult,
} from "@tanstack/react-query";

// Define types for API function parameters

// React Query hooks - Updated for v5 syntax
export const useSupabaseQuery = <T>(
  table: string,
  options?: QueryOptions,
  queryOptions?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: [table, options],
    queryFn: () => supabaseApi.fetchTable<T>({ table, options }),
    ...queryOptions,
  });
};

export const useSupabaseQueryById = <T>(
  table: string,
  id: string | number | null | undefined,
  options?: Omit<QueryOptions, "filters" | "single">,
  queryOptions?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn" | "enabled">
) => {
  return useQuery({
    queryKey: [table, id, options],
    queryFn: () => {
      if (!id) throw new Error("ID is required");
      return supabaseApi.fetchById<T>({ table, id, options });
    },
    enabled: !!id,
    ...queryOptions,
  });
};

export const useSupabaseCreate = <T>(
  table: string,
  options?: MutationOptions & {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
): UseMutationResult<T, Error, Partial<T>> => {
  return useMutation({
    mutationFn: (data: Partial<T>) =>
      supabaseApi.create<T>({
        table,
        data,
        options: {
          returning: options?.returning,
          onConflict: options?.onConflict,
          ignoreDuplicates: options?.ignoreDuplicates,
          upsert: options?.upsert,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useSupabaseUpdate = <T>(
  table: string,
  options?: MutationOptions & {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
): UseMutationResult<T, Error, { id: string | number; data: Partial<T> }> => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<T> }) =>
      supabaseApi.update<T>({
        table,
        id,
        data,
        options: {
          returning: options?.returning,
          onConflict: options?.onConflict,
          ignoreDuplicates: options?.ignoreDuplicates,
          upsert: options?.upsert,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useSupabaseDelete = <T>(
  table: string,
  options?: Pick<MutationOptions, "returning"> & {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
): UseMutationResult<T, Error, string | number> => {
  return useMutation({
    mutationFn: (id: string | number) =>
      supabaseApi.delete<T>({
        table,
        id,
        options: {
          returning: options?.returning,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useSupabaseBulkCreate = <T>(
  table: string,
  options?: MutationOptions & {
    onSuccess?: (data: T[]) => void;
    onError?: (error: Error) => void;
  }
): UseMutationResult<T[], Error, Partial<T>[]> => {
  return useMutation({
    mutationFn: (data: Partial<T>[]) =>
      supabaseApi.bulkCreate<T>({
        table,
        data,
        options: {
          returning: options?.returning,
          onConflict: options?.onConflict,
          ignoreDuplicates: options?.ignoreDuplicates,
          upsert: options?.upsert,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useSupabaseBulkUpdate = <T>(
  table: string,
  options?: MutationOptions & {
    onSuccess?: (data: T[]) => void;
    onError?: (error: Error) => void;
  }
): UseMutationResult<
  T[],
  Error,
  { data: Partial<T>; filters: QueryFilters }
> => {
  return useMutation({
    mutationFn: ({
      data,
      filters,
    }: {
      data: Partial<T>;
      filters: QueryFilters;
    }) =>
      supabaseApi.bulkUpdate<T>({
        table,
        data,
        filters,
        options: {
          returning: options?.returning,
          onConflict: options?.onConflict,
          ignoreDuplicates: options?.ignoreDuplicates,
          upsert: options?.upsert,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useSupabaseBulkDelete = <T>(
  table: string,
  options?: Pick<MutationOptions, "returning"> & {
    onSuccess?: (data: T[]) => void;
    onError?: (error: Error) => void;
  }
): UseMutationResult<T[], Error, QueryFilters> => {
  return useMutation({
    mutationFn: (filters: QueryFilters) =>
      supabaseApi.bulkDelete<T>({
        table,
        filters,
        options: {
          returning: options?.returning,
        },
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [table] });
      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
};

export const useSupabaseUpload = (
  bucket: string,
  options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
  }
): UseMutationResult<
  any,
  Error,
  { path: string; file: File; upsert?: boolean; contentType?: string }
> => {
  return useMutation({
    mutationFn: ({
      path,
      file,
      upsert,
      contentType,
    }: {
      path: string;
      file: File;
      upsert?: boolean;
      contentType?: string;
    }) =>
      supabaseApi.uploadFile({
        bucket,
        path,
        file,
        options: { upsert, contentType },
      }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

export const useSupabaseRpc = <
  T,
  P extends Record<string, any> | undefined = Record<string, any>
>(
  fn: string,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
): UseMutationResult<T, Error, P> => {
  return useMutation({
    mutationFn: (params: P) => supabaseApi.rpc<T>({ fn, params }),
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

// Data provider factory
const createDataProvider = () => {
  return {
    // Base API functions
    api: supabaseApi,

    // React Query hooks
    useQuery: useSupabaseQuery,
    useQueryById: useSupabaseQueryById,
    useCreate: useSupabaseCreate,
    useUpdate: useSupabaseUpdate,
    useDelete: useSupabaseDelete,
    useBulkCreate: useSupabaseBulkCreate,
    useBulkUpdate: useSupabaseBulkUpdate,
    useBulkDelete: useSupabaseBulkDelete,
    useUpload: useSupabaseUpload,
    useRpc: useSupabaseRpc,
  };
};

const dataProvider = createDataProvider();

export default dataProvider;
