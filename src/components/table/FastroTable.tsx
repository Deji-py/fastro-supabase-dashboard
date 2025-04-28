import React, { useCallback, useState } from "react";
import { Box, Title } from "@mantine/core";
import { MantineReactTable } from "mantine-react-table";
import { ModalsProvider } from "@mantine/modals";
import { type ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import TableModals from "./TableModals";
import { useTableConfig } from "@/hooks/useTableConfig";

import { BulkAction } from "@/types/table_types";
import {
  handleBulkDelete,
  handleDeleteRow,
  openBullBoard,
  renderCustomActions,
} from "@/utils/_table_actions";
import { useTableSelection } from "@/hooks/useTableSelection";
import { CustomRowAction } from "./TableActions";

type FastroTableProps<T extends object> = {
  data: T[];
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
  customActions?:
    | React.ReactNode
    | ((props: CustomActionProps<T>) => React.ReactNode);
  customPreview?:
    | React.ReactNode
    | ((props: CustomPreviewProps<T>) => React.ReactNode);
  dropdownOptions?: Array<{
    field: string;
    options: Array<{ value: string; label: string }>;
  }>;
  editableColumns?: (keyof T)[];
  createTemplate?: Partial<T>;
  rowsPerPage?: number;
  maxHeight?: string | number;
  previewExcludeFields?: (keyof T)[];
  previewLabelMap?: Partial<Record<keyof T, string>>;
  loading?: boolean;
  customRowActions?: CustomRowAction<T>[];
};

export type CustomActionProps<T> = {
  selectedRows: T[];
  onActionComplete?: () => void;
};

export type CustomPreviewProps<T> = {
  data: T;
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onPreview: () => void;
};

function FastroTable<T extends object>({
  data,
  columnVariants,
  title = "",
  enableCreate = false,
  enableEdit = true,
  enableDelete = true,
  enableRowSelection = true,
  enableFiltering = true,
  enableColumnOrdering = false,
  enablePagination = true,
  enablePreview = true,
  enableCSVImport = false,
  onRowCreate,
  onRowUpdate,
  onRowDelete,
  onBulkDelete,
  loading,
  onCSVImport,
  onSelectionChange,
  bulkActions = [],
  customActions,
  customPreview,
  dropdownOptions = [],
  editableColumns = [],
  createTemplate = {} as Partial<T>,
  rowsPerPage = 10,
  maxHeight = "600px",
  previewExcludeFields = [],
  previewLabelMap = {},
  customRowActions,
}: FastroTableProps<T>) {
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCSVImportModalOpen, setIsCSVImportModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<T | null>(null);

  // Selection handling with custom hook
  const { rowSelection, selectedRows, setRowSelection, clearSelection } =
    useTableSelection<T>(onSelectionChange);

  // Handlers for row operations
  const handleCreateRow = useCallback(
    async (values: any) => {
      const newRow = { ...createTemplate, ...values } as T;
      if (onRowCreate) {
        await onRowCreate(newRow);
      }
      setIsCreateModalOpen(false);
    },
    [createTemplate, onRowCreate]
  );

  // Open preview modal
  const openPreviewModal = useCallback((row: T) => {
    setCurrentRow(row);
    setIsPreviewModalOpen(true);
  }, []);

  const handlerenderCustomActions = useCallback(() => {
    return renderCustomActions(customActions, selectedRows, clearSelection);
  }, []);

  const handleUpdateRow = useCallback(
    async (values: any) => {
      if (!currentRow) return;
      const updatedRow = { ...currentRow, ...values } as T;
      if (onRowUpdate) {
        await onRowUpdate(updatedRow, currentRow);
      }
      setIsEditModalOpen(false);
      setCurrentRow(null);
    },
    [currentRow, onRowUpdate]
  );

  const handleCSVImportSuccess = useCallback((data: any) => {
    if (data.success && !data.jobId) {
      console.log("CSV import successful, refreshing data...");
    }
  }, []);

  // Get memoized table configuration
  const { table } = useTableConfig<T>({
    data,
    columnVariants,
    enableEdit,
    enableDelete,
    enableRowSelection,
    enableFiltering,
    enableColumnOrdering,
    enablePagination,
    enablePreview,
    loading,
    rowSelection,
    setRowSelection,
    selectedRows,
    maxHeight,
    rowsPerPage,
    openPreviewModal,
    onRowDelete,
    onBulkDelete,
    customActions,
    bulkActions,
    editableColumns,
    createTemplate,
    setIsEditModalOpen,
    setCurrentRow,
    setIsCreateModalOpen,
    setIsCSVImportModalOpen,
    clearSelection,
    enableCreate,
    enableCSVImport,
    handleDeleteRow: handleDeleteRow,
    handleBulkDelete: handleBulkDelete,
    openBullBoard: openBullBoard,
    renderCustomAction: handlerenderCustomActions,
    title: title,
    customRowActions: customRowActions as CustomRowAction<T>[],
  });

  return (
    <Box>
      <MantineReactTable table={table} />

      <TableModals<T>
        isCreateModalOpen={isCreateModalOpen}
        isEditModalOpen={isEditModalOpen}
        isPreviewModalOpen={isPreviewModalOpen}
        isCSVImportModalOpen={isCSVImportModalOpen}
        currentRow={currentRow}
        createTemplate={createTemplate as T}
        columnVariants={columnVariants}
        dropdownOptions={dropdownOptions}
        handleCreateRow={handleCreateRow}
        handleUpdateRow={handleUpdateRow}
        handleCSVImportSuccess={handleCSVImportSuccess}
        setIsCreateModalOpen={setIsCreateModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        setIsPreviewModalOpen={setIsPreviewModalOpen}
        setIsCSVImportModalOpen={setIsCSVImportModalOpen}
        setCurrentRow={setCurrentRow}
        customPreview={customPreview}
        previewExcludeFields={previewExcludeFields as any}
        previewLabelMap={previewLabelMap}
        handleDeleteRow={handleDeleteRow}
        handlePreviewRow={openPreviewModal}
      />
    </Box>
  );
}

export default React.memo(FastroTable) as typeof FastroTable;
