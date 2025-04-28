import { useFastroData } from "@/lib/Fastro";
import { FastroNotification } from "@/utils/FastroNotification";
import { nprogress } from "@mantine/nprogress";
import { useCallback, useMemo } from "react";

export default function useFastroTable<T>({
  tableName,
  onSuccessCreate,
  onSuccessUpdate,
  onSuccessDelete,
  onSuccessBulkDelete,
  returning = "*",
  rpcQuery, // Add the RPC query parameter
}: {
  tableName?: string;
  onSuccessCreate?: (data: any) => void;
  onSuccessUpdate?: (data: any) => void;
  onSuccessDelete?: (data: any) => void;
  onSuccessBulkDelete?: (data: any) => void;
  returning?: string;
  rpcQuery?: string; // Accept a custom RPC query
}) {
  const { useQuery, useCreate, useUpdate, useDelete, useBulkDelete, useRpc } =
    useFastroData();

  // Query data from the table if no rpcQuery is provided
  const { data, isLoading, isError } = useQuery<T[]>(tableName as string, {
    select: returning,
    order: [{ column: "created_at", ascending: false }],
    enabled: !rpcQuery, // Disable useQuery if rpcQuery is provided
  });

  // Query data from the custom RPC function if `rpcQuery` is provided
  const {
    data: rpcData,
    isError: rpcError,
    isPending,
  } = useRpc<T[]>(rpcQuery || "");

  // Combine the results, prioritizing RPC data if available
  const finalData = rpcQuery ? rpcData : data;

  // Helper function to trigger notifications
  const triggerNotification = useCallback(
    (type: "success" | "error", title: string, message: string) => {
      FastroNotification({
        type,
        title,
        message,
      });
    },
    []
  );

  // Create mutation
  const createMutation = useCreate<T>(tableName as string, {
    returning,
    onSuccess: (data) => {
      onSuccessCreate?.(data);
      triggerNotification(
        "success",
        `New ${tableName} Created Successfully!!`,
        "You have successfully created data."
      );
    },
    onError: (error) => {
      triggerNotification(
        "error",
        `Error Creating ${tableName}`,
        `There was an error while creating data: ${error.message}`
      );
    },
  });

  // Update mutation
  const updateMutation = useUpdate<T>(tableName as string, {
    returning,
    onSuccess: (data) => {
      onSuccessUpdate?.(data);
      triggerNotification(
        "success",
        `${tableName} Updated Successfully`,
        "You have successfully updated data."
      );
    },
    onError: (error) => {
      triggerNotification(
        "error",
        `Error Updating ${tableName}`,
        `There was an error while updating data: ${error.message}`
      );
    },
  });

  // Delete mutation
  const deleteMutation = useDelete<T>(tableName as string, {
    returning,
    onSuccess: (data) => {
      onSuccessDelete?.(data);
      triggerNotification(
        "success",
        `${tableName} Deleted Successfully`,
        "You have successfully deleted the data."
      );
    },
    onError: (error) => {
      triggerNotification(
        "error",
        `Error Deleting ${tableName}`,
        `There was an error while deleting data: ${error.message}`
      );
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useBulkDelete<T>(tableName as string, {
    returning,
    onSuccess: (data) => {
      onSuccessBulkDelete?.(data);
      triggerNotification(
        "success",
        `Bulk Deletion of ${tableName} Successful`,
        "You have successfully deleted multiple entries."
      );
    },
    onError: (error) => {
      triggerNotification(
        "error",
        `Error Bulk Deleting ${tableName}`,
        `There was an error while bulk deleting data: ${error.message}`
      );
    },
  });

  // Handle row creation
  const handleCreateRow = useCallback(
    async (data: Partial<T>) => {
      nprogress.start();
      await createMutation.mutateAsync(data);
      nprogress.complete();
    },
    [createMutation]
  );

  // Handle row update
  const handleUpdateRow = useCallback(
    async (newData: T, oldData: T) => {
      const { id: oldId } = oldData as { id: string };
      nprogress.start();
      await updateMutation.mutateAsync({ id: oldId, data: newData });
      nprogress.complete();
    },
    [updateMutation]
  );

  // Handle row deletion
  const handleDeleteRow = useCallback(
    async (data: T) => {
      const { id: data_id } = data as { id: string };
      nprogress.start();
      await deleteMutation.mutateAsync(data_id);
      nprogress.complete();
    },
    [deleteMutation]
  );

  // Handle bulk deletion
  const handleBulkDelete = useCallback(
    async (data: T[]) => {
      const ids = data.map((item: any) => item.id.toString());
      nprogress.start();
      await bulkDeleteMutation.mutateAsync({ in: { id: ids } });
      nprogress.complete();
    },
    [bulkDeleteMutation]
  );

  // Memoize the data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => finalData || [], [finalData]);

  return {
    data: memoizedData,
    isLoading: isLoading || isPending,
    isError: isError || rpcError,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    handleBulkDelete,
  };
}
