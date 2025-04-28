import { useMemo } from "react";
import {
  useMantineReactTable,
  type MRT_TableOptions,
} from "mantine-react-table";
import {
  generateColumns,
  type ColumnVariantMap,
} from "@/utils/FastroColumnGenerator";

import { type BulkAction } from "@/types/table_types";
import {
  CustomRowAction,
  EmptyRowsFallback,
  RowActions,
  TopToolbarCustomActions,
} from "@/components/table/TableActions";

interface UseTableConfigProps<T extends object> {
  data: T[];
  columnVariants: ColumnVariantMap<T>;
  enableEdit: boolean;
  enableDelete: boolean;
  enableRowSelection: boolean;
  enableFiltering: boolean;
  enableColumnOrdering: boolean;
  enablePagination: boolean;
  enablePreview: boolean;
  loading?: boolean;
  rowSelection: Record<string, boolean>;
  setRowSelection: (value: Record<string, boolean>) => void;
  selectedRows: T[];
  maxHeight: string | number;
  rowsPerPage: number;
  openPreviewModal: (row: T) => void;
  onRowDelete?: (data: T) => Promise<void> | void;
  onBulkDelete?: (data: T[]) => Promise<void> | void;
  customActions?: any;
  bulkActions: BulkAction<T>[];
  editableColumns: (keyof T)[];
  createTemplate: Partial<T>;
  setIsEditModalOpen: (value: boolean) => void;
  setCurrentRow: (row: T | null) => void;
  setIsCreateModalOpen: (value: boolean) => void;
  setIsCSVImportModalOpen: (value: boolean) => void;
  clearSelection: () => void;
  enableCreate: boolean;
  enableCSVImport: boolean;
  handleDeleteRow: (row: T) => void;
  handleBulkDelete: (rows: T[]) => void;
  openBullBoard: () => void;
  renderCustomAction: () => void;
  title?: string;
  customRowActions: CustomRowAction<T>[];
}

export function useTableConfig<T extends object>({
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
  editableColumns,
  createTemplate,
  setIsEditModalOpen,
  setCurrentRow,
  enableCreate,
  enableCSVImport,
  setIsCreateModalOpen,
  setIsCSVImportModalOpen,
  clearSelection,
  bulkActions,
  handleDeleteRow,
  handleBulkDelete,
  openBullBoard,
  renderCustomAction,
  customRowActions,
  title,
}: UseTableConfigProps<T>) {
  // Generate columns based on data and variant map
  const columns = useMemo(
    () =>
      generateColumns(
        data?.length ? data : [createTemplate as T],
        columnVariants,
        editableColumns
      ),
    [data, columnVariants, editableColumns, createTemplate]
  );

  const tableOptions = useMemo<MRT_TableOptions<T>>(
    () => ({
      columns,
      data,
      enableStickyHeader: true,
      enableEditing: enableEdit,
      enableColumnOrdering: enableColumnOrdering,
      enableGlobalFilter: enableFiltering,
      enableRowSelection: enableRowSelection,
      enablePagination: enablePagination,
      enableColumnPinning: true,
      state: {
        showSkeletons: loading,
        rowSelection,
      },
      onRowSelectionChange: setRowSelection as any,
      mantineTableContainerProps: {
        style: { maxHeight },
      },
      mantinePaperProps: {
        shadow: "none",
        withBorder: true,
        radius: "md",
      },
      enableRowActions: enableEdit || enableDelete || enablePreview,
      positionActionsColumn: "last",
      initialState: {
        density: "xs",
        pagination: { pageSize: rowsPerPage, pageIndex: 0 },
        columnPinning: {
          right: ["mrt-row-actions"],
        },
      },
      renderRowActions: ({ row }) => (
        <RowActions
          row={row}
          enablePreview={enablePreview}
          enableEdit={enableEdit}
          enableDelete={enableDelete}
          openPreviewModal={openPreviewModal}
          handleDeleteRow={handleDeleteRow}
          setIsEditModalOpen={setIsEditModalOpen}
          setCurrentRow={setCurrentRow}
          customRowActions={customRowActions as any}
        />
      ),
      renderTopToolbarCustomActions: () => (
        <TopToolbarCustomActions
          enableCreate={enableCreate}
          enableCSVImport={enableCSVImport}
          selectedRows={selectedRows}
          bulkActions={bulkActions}
          renderCustomActions={renderCustomAction}
          handleBulkDelete={handleBulkDelete}
          openBullBoard={openBullBoard}
          setIsCreateModalOpen={setIsCreateModalOpen}
          setIsCSVImportModalOpen={setIsCSVImportModalOpen}
          clearSelection={clearSelection}
          title={title}
        />
      ),
      renderEmptyRowsFallback: () => <EmptyRowsFallback />,
      mantineTableProps: {
        highlightOnHover: false,
        withColumnBorders: true,
        withTableBorder: true,
        withRowBorders: true,
        striped: true,
        stripedColor: "#f7f7f7",
      },
    }),
    [
      columns,
      data,
      enableEdit,
      enableColumnOrdering,
      enableFiltering,
      enableRowSelection,
      enablePagination,
      loading,
      rowSelection,
      setRowSelection,
      maxHeight,
      rowsPerPage,
      enablePreview,
      enableDelete,
      openPreviewModal,
      handleDeleteRow,
      setIsEditModalOpen,
      setCurrentRow,
      enableCreate,
      enableCSVImport,
      selectedRows,
      bulkActions,
      handleBulkDelete,
      openBullBoard,
      setIsCreateModalOpen,
      setIsCSVImportModalOpen,
      clearSelection,
    ]
  );

  const table = useMantineReactTable(tableOptions);

  return { table, tableOptions };
}
