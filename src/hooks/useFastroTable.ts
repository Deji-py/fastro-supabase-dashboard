"use client";
import { useFastroData } from "@/lib/Fastro";
import { FastroNotification } from "@/utils/FastroNotification";
import { nprogress } from "@mantine/nprogress";

export default function useFastroTable<T>({
  tableName,
  onSuccessCreate,
  onSuccessUpdate,
  onSuccessDelete,
  onSuccessBulkDelete,
  returning = "*",
}: {
  tableName: string;
  onSuccessCreate?: (data: any) => void;
  onSuccessUpdate?: (data: any) => void;
  onSuccessDelete?: (data: any) => void;
  onSuccessBulkDelete?: (data: any) => void;
  returning?: string;
  ignore_columns?: string[]; // Added ignore_columns option
}) {
  const { useQuery, useCreate, useUpdate, useDelete, useBulkDelete } =
    useFastroData();

  // Query the data
  const { data, isLoading, isError } = useQuery<T[]>(tableName, {
    select: returning,
    order: [{ column: "created_at", ascending: false }],
  });

  // Create mutation
  const createMutation = useCreate<T>(tableName, {
    returning: returning,
    onSuccess: (data) => {
      onSuccessCreate?.(data);
      FastroNotification({
        type: "success",
        title: `New ${tableName} Created Successfully!!`,
        message: "You have successfully created data.",
      });
    },
    onError: (error) => {
      FastroNotification({
        type: "error",
        title: `Error Creating ${tableName}`,
        message: `There was an error while creating data: ${error.message}`,
      });
    },
  });

  // Update mutation
  const updateMutation = useUpdate<T>(tableName, {
    returning: returning,
    onSuccess: (data) => {
      onSuccessUpdate?.(data);
      FastroNotification({
        type: "success",
        title: `${tableName} Updated Successfully`,
        message: "You have successfully updated data.",
      });
    },
    onError: (error) => {
      FastroNotification({
        type: "error",
        title: `Error Updating ${tableName}`,
        message: `There was an error while updating data: ${error.message}`,
      });
    },
  });

  // Delete mutation
  const deleteMutation = useDelete<T>(tableName, {
    returning: returning,
    onSuccess: (data) => {
      onSuccessDelete?.(data);
      FastroNotification({
        type: "success",
        title: `${tableName} Deleted Successfully`,
        message: "You have successfully deleted the data.",
      });
    },
    onError: (error) => {
      FastroNotification({
        type: "error",
        title: `Error Deleting ${tableName}`,
        message: `There was an error while deleting data: ${error.message}`,
      });
    },
  });

  // Bulk delete mutation
  const bulkDeleteMutation = useBulkDelete<T>(tableName, {
    returning: returning,
    onSuccess: (data) => {
      onSuccessBulkDelete?.(data);
      FastroNotification({
        type: "success",
        title: `Bulk Deletion of ${tableName} Successful`,
        message: "You have successfully deleted multiple entries.",
      });
    },
    onError: (error) => {
      FastroNotification({
        type: "error",
        title: `Error Bulk Deleting ${tableName}`,
        message: `There was an error while bulk deleting data: ${error.message}`,
      });
    },
  });

  // Handle row creation
  const handleCreateRow = async (data: Partial<T>) => {
    nprogress.start();
    await createMutation.mutateAsync(data);
    nprogress.complete();
  };

  // Handle row update
  const handleUpdateRow = async (newData: T, oldData: T) => {
    const { id: oldId } = oldData as { id: string };
    nprogress.start();
    await updateMutation.mutateAsync({ id: oldId, data: newData });
    nprogress.complete();
  };

  // Handle row deletion
  const handleDeleteRow = async (data: T) => {
    const { id: data_id } = data as { id: string };
    nprogress.start();
    await deleteMutation.mutateAsync(data_id);
    nprogress.complete();
  };

  // Handle bulk deletion
  const handleBulkDelete = async <T extends { id: string }>(data: T[]) => {
    const ids = data.map((item) => item.id.toString());
    nprogress.start();
    await bulkDeleteMutation.mutateAsync({ in: { id: ids } });
    nprogress.complete();
  };

  return {
    data: data || [],
    isLoading,
    isError,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    handleBulkDelete,
  };
}
