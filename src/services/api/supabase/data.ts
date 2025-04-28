import { supabaseClient } from "@/services/supabase/client";
import {
  BulkCreateParams,
  BulkDeleteParams,
  BulkUpdateParams,
  CreateParams,
  DeleteParams,
  FetchByIdParams,
  FetchTableParams,
  GetPublicUrlParams,
  QueryFilters,
  RpcParams,
  UpdateParams,
  UploadFileParams,
} from "@/types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

// Helper function to apply filters
const applyFilters = (
  query: PostgrestFilterBuilder<any, any, any>,
  filters?: QueryFilters
): PostgrestFilterBuilder<any, any, any> => {
  if (!filters) return query;

  let filteredQuery = query;

  // Apply equality filters
  if (filters.eq) {
    Object.entries(filters.eq).forEach(([column, value]) => {
      filteredQuery = filteredQuery.eq(column, value);
    });
  }

  // Apply inequality filters
  if (filters.neq) {
    Object.entries(filters.neq).forEach(([column, value]) => {
      filteredQuery = filteredQuery.neq(column, value);
    });
  }

  // Apply greater than filters
  if (filters.gt) {
    Object.entries(filters.gt).forEach(([column, value]) => {
      filteredQuery = filteredQuery.gt(column, value);
    });
  }

  // Apply greater than or equal filters
  if (filters.gte) {
    Object.entries(filters.gte).forEach(([column, value]) => {
      filteredQuery = filteredQuery.gte(column, value);
    });
  }

  // Apply less than filters
  if (filters.lt) {
    Object.entries(filters.lt).forEach(([column, value]) => {
      filteredQuery = filteredQuery.lt(column, value);
    });
  }

  // Apply less than or equal filters
  if (filters.lte) {
    Object.entries(filters.lte).forEach(([column, value]) => {
      filteredQuery = filteredQuery.lte(column, value);
    });
  }

  // Apply LIKE filters
  if (filters.like) {
    Object.entries(filters.like).forEach(([column, value]) => {
      filteredQuery = filteredQuery.like(column, value);
    });
  }

  // Apply ILIKE filters
  if (filters.ilike) {
    Object.entries(filters.ilike).forEach(([column, value]) => {
      filteredQuery = filteredQuery.ilike(column, value);
    });
  }

  // Apply IN filters
  if (filters.in) {
    Object.entries(filters.in).forEach(([column, values]) => {
      filteredQuery = filteredQuery.in(column, values);
    });
  }

  // Apply contains filters
  if (filters.contains) {
    Object.entries(filters.contains).forEach(([column, value]) => {
      filteredQuery = filteredQuery.contains(column, value);
    });
  }

  // Apply containedBy filters
  if (filters.containedBy) {
    Object.entries(filters.containedBy).forEach(([column, value]) => {
      filteredQuery = filteredQuery.containedBy(column, value);
    });
  }

  // Apply range filters
  if (filters.rangeGt) {
    Object.entries(filters.rangeGt).forEach(([column, value]) => {
      filteredQuery = filteredQuery.rangeGt(column, value);
    });
  }

  if (filters.rangeGte) {
    Object.entries(filters.rangeGte).forEach(([column, value]) => {
      filteredQuery = filteredQuery.rangeGte(column, value);
    });
  }

  if (filters.rangeLt) {
    Object.entries(filters.rangeLt).forEach(([column, value]) => {
      filteredQuery = filteredQuery.rangeLt(column, value);
    });
  }

  if (filters.rangeLte) {
    Object.entries(filters.rangeLte).forEach(([column, value]) => {
      filteredQuery = filteredQuery.rangeLte(column, value);
    });
  }

  // Apply text search filters
  if (filters.textSearch) {
    Object.entries(filters.textSearch).forEach(([column, value]) => {
      filteredQuery = filteredQuery.textSearch(column, value);
    });
  }

  // Apply match filters
  if (filters.match) {
    Object.entries(filters.match).forEach(([column, value]) => {
      filteredQuery = filteredQuery.match({ column, value });
    });
  }

  return filteredQuery;
};

// Base API functions
export const supabaseApi = {
  // Fetch all records from a table
  fetchTable: async <T>({
    table,
    options,
  }: FetchTableParams): Promise<{ data: T; count: number | null }> => {
    try {
      let query = supabaseClient
        .from(table)
        .select(
          options?.select || "*",
          options?.count ? { count: options.count } : undefined
        );

      // Apply filters
      if (options?.filters) {
        query = applyFilters(query, options.filters);
      }

      // Apply ordering
      if (options?.order) {
        options.order.forEach(({ column, ascending = true }) => {
          query = query.order(column, { ascending });
        });
      }

      // Apply pagination
      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(
          options.offset,
          options.offset + (options.limit || 10) - 1
        );
      }

      // Execute query based on options
      let result;

      if (options?.single) {
        result = await query.single();
      } else if (options?.maybeSingle) {
        result = await query.maybeSingle();
      } else if (options?.head) {
        result = await query.limit(0).select("*");
      } else {
        result = await query;
      }

      if (result.error) {
        throw result.error;
      }

      return {
        data: result.data as T,
        count: result.count ?? null,
      };
    } catch (error) {
      console.log(`Error fetching from ${table}:`, error);
      throw error;
    }
  },

  // Fetch a single record by ID
  fetchById: async <T>({ table, id, options }: FetchByIdParams): Promise<T> => {
    try {
      let query = supabaseClient
        .from(table)
        .select(options?.select || "*")
        .eq("id", id);

      const { data, error } = await query.single();

      if (error) {
        throw error;
      }

      return data as T;
    } catch (error) {
      console.log(`Error fetching ${table} by ID:`, error);
      throw error;
    }
  },

  // Create a new record
  create: async <T>({ table, data, options }: CreateParams<T>): Promise<T> => {
    try {
      const isUpsert = options?.upsert || options?.onConflict;

      const query = isUpsert
        ? supabaseClient
            .from(table)
            .upsert(data, {
              onConflict: options?.onConflict,
              ignoreDuplicates: options.ignoreDuplicates,
            })
            .select(options.returning)
        : supabaseClient.from(table).insert(data).select(options?.returning);

      const result = await query;

      if (result.error) {
        throw result.error;
      }

      return result.data?.[0] as T;
    } catch (error) {
      console.log(`Error creating record in ${table}:`, error);
      throw error;
    }
  },

  // Update a record by ID
  update: async <T>({
    table,
    id,
    data,
    options,
  }: UpdateParams<T>): Promise<T> => {
    try {
      const query = supabaseClient
        .from(table)
        .update(data)
        .eq("id", id)
        .select(options?.returning || "*"); // defaults to '*' if not provided

      const result = await query;

      if (result.error) {
        throw result.error;
      }

      return result.data?.[0] as T;
    } catch (error) {
      console.log(`Error updating record in ${table}:`, error);
      throw error;
    }
  },

  // Delete a record by ID
  delete: async <T>({ table, id, options }: DeleteParams): Promise<T> => {
    try {
      const query = supabaseClient
        .from(table)
        .delete()
        .eq("id", id)
        .select(options?.returning || "*"); // default to '*' if not set

      const result = await query;

      if (result.error) {
        throw result.error;
      }

      return result.data?.[0] as T;
    } catch (error) {
      console.log(`Error deleting record from ${table}:`, error);
      throw error;
    }
  },

  // Bulk create records
  bulkCreate: async <T>({
    table,
    data,
    options,
  }: BulkCreateParams<T>): Promise<T[]> => {
    try {
      const {
        returning = "*",
        onConflict,
        ignoreDuplicates,
        upsert,
      } = options || {};

      const isUpsert = !!upsert || !!onConflict;

      const query = isUpsert
        ? supabaseClient
            .from(table)
            .upsert(data, { onConflict, ignoreDuplicates })
            .select(returning)
        : supabaseClient.from(table).insert(data).select(returning);

      const result = await query;

      if (result.error) {
        throw result.error;
      }

      return result.data as T[];
    } catch (error) {
      console.log(`Error bulk creating records in ${table}:`, error);
      throw error;
    }
  },

  // Bulk update records based on a filter
  bulkUpdate: async <T>({
    table,
    data,
    filters,
    options,
  }: BulkUpdateParams<T>): Promise<T[]> => {
    try {
      let query = supabaseClient.from(table).update(data);

      // Apply dynamic filters and returning fields via queryFilter
      const result = await applyFilters(query, filters).select(
        options?.returning || "*"
      );

      if (result.error) {
        throw result.error;
      }

      return result.data as T[];
    } catch (error) {
      console.log(`Error bulk updating records in ${table}:`, error);
      throw error;
    }
  },

  // Bulk delete records based on a filter
  bulkDelete: async <T>({
    table,
    filters,
    options,
  }: BulkDeleteParams): Promise<T[]> => {
    try {
      const query = supabaseClient.from(table).delete();

      const result = await applyFilters(query, filters).select(
        options?.returning || "*"
      );

      if (result.error) {
        throw result.error;
      }

      return result.data as T[];
    } catch (error) {
      console.log(`Error bulk deleting records from ${table}:`, error);
      throw error;
    }
  },

  // Upload a file to Supabase Storage
  uploadFile: async ({ bucket, path, file, options }: UploadFileParams) => {
    try {
      const { data, error } = await supabaseClient.storage
        .from(bucket)
        .upload(path, file, {
          upsert: options?.upsert || false,
          contentType: options?.contentType,
        });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.log(`Error uploading file to ${bucket}/${path}:`, error);
      throw error;
    }
  },

  // Get a public URL for a file
  getPublicUrl: ({ bucket, path }: GetPublicUrlParams) => {
    const { data } = supabaseClient.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  // Execute a custom RPC function
  rpc: async <T>({ fn, params }: RpcParams): Promise<T> => {
    try {
      const { data, error } = await supabaseClient.rpc(fn, params);

      if (error) {
        throw error;
      }

      return data as T;
    } catch (error) {
      console.log(`Error executing RPC function ${fn}:`, error);
      throw error;
    }
  },
};
