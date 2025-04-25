"use client";

import React, { useCallback, useMemo, useState, type ReactNode } from "react";
import {
  ActionIcon,
  Button,
  Container,
  Flex,
  Modal,
  Text,
  Title,
  Group,
  Menu,
} from "@mantine/core";
import {
  MantineReactTable,
  type MRT_TableOptions,
  useMantineReactTable,
} from "mantine-react-table";
import {
  type ColumnVariantMap,
  generateColumns,
  formDataToTableData,
} from "@/utils/FastroColumnGenerator";
import { ModalsProvider, modals } from "@mantine/modals";
import {
  IconEdit,
  IconTrash,
  IconPlus,
  IconEye,
  IconDotsVertical,
  IconUpload,
  IconExternalLink,
} from "@tabler/icons-react";
import FastroDataEditor from "./FastroDataEditor";
import type { BulkAction } from "./FastroBulkActions";
import FastroDataPreview from "./FastroDataPreview";
import CSVImportModal from "./CSVImportModal";
import { BATCH_PROCESSOR_URL } from "@/app_meta/constants";

type CustomActionProps<T> = {
  selectedRows: T[];
  onActionComplete?: () => void;
};

type CustomPreviewProps<T> = {
  data: T;
  onClose: () => void;
};

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
};

function FastroTable<T extends object>({
  data,
  columnVariants,
  title = "Data Table",
  enableCreate = true,
  enableEdit = true,
  enableDelete = true,
  enableRowSelection = true,
  enableFiltering = true,
  enableColumnOrdering = true,
  enablePagination = true,
  enablePreview = true,
  enableCSVImport = false,
  onRowCreate,
  onRowUpdate,
  onRowDelete,
  onBulkDelete,
  onCSVImport,
  onSelectionChange,
  bulkActions = [],
  customActions,
  customPreview,
  dropdownOptions = [],
  emptyState,
  editableColumns = [],
  createTemplate = {} as Partial<T>,
  rowsPerPage = 10,
  maxHeight = "600px",
  previewExcludeFields = [],
  previewLabelMap = {},
}: FastroTableProps<T>) {
  const [tableData, setTableData] = useState<T[]>(data);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCSVImportModalOpen, setIsCSVImportModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<T | null>(null);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [rowSelection, setRowSelection] = useState({});

  // Update local data when props change
  React.useEffect(() => {
    setTableData(data);
  }, [data]);

  // Generate columns based on data and variant map
  const columns = useMemo(
    () =>
      generateColumns(
        tableData?.length ? tableData : [createTemplate as T],
        columnVariants,
        editableColumns
      ),
    [tableData, columnVariants, createTemplate, editableColumns]
  );

  // Handle row creation
  const handleCreateRow = useCallback(
    async (values: any) => {
      const newRow = { ...createTemplate, ...values } as T;

      if (onRowCreate) {
        await onRowCreate(newRow);
      }

      setTableData((prev) => [...prev, newRow]);
      setIsCreateModalOpen(false);
    },
    [createTemplate, onRowCreate]
  );

  // Handle row update
  const handleUpdateRow = useCallback(
    async (values: any) => {
      if (!currentRow) return;

      const updatedRow = formDataToTableData(values, currentRow);

      if (onRowUpdate) {
        await onRowUpdate(updatedRow, currentRow);
      }

      setTableData((prev) =>
        prev.map((row) => (row === currentRow ? updatedRow : row))
      );

      setIsEditModalOpen(false);
      setCurrentRow(null);
    },
    [currentRow, onRowUpdate]
  );

  // Handle row deletion
  const handleDeleteRow = useCallback(
    async (row: T) => {
      modals.openConfirmModal({
        title: "Delete Confirmation",
        children: (
          <Text>
            Are you sure you want to delete this item? This action cannot be
            undone.
          </Text>
        ),
        labels: { confirm: "Delete", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onConfirm: async () => {
          if (onRowDelete) {
            await onRowDelete(row);
          }
          setTableData((prev) => prev.filter((item) => item !== row));
        },
      });
    },
    [onRowDelete]
  );

  // Handle bulk deletion
  const handleBulkDelete = useCallback(
    async (rows: T[]) => {
      if (!rows.length) return;

      modals.openConfirmModal({
        title: "Delete Confirmation",
        children: (
          <Text>
            Are you sure you want to delete {rows.length} item
            {rows.length !== 1 ? "s" : ""}? This action cannot be undone.
          </Text>
        ),
        labels: { confirm: "Delete All", cancel: "Cancel" },
        confirmProps: { color: "red" },
        onConfirm: async () => {
          if (onBulkDelete) {
            await onBulkDelete(rows);
          } else {
            // If no bulk delete handler is provided, delete one by one
            for (const row of rows) {
              if (onRowDelete) {
                await onRowDelete(row);
              }
            }
          }

          setTableData((prev) => prev.filter((item) => !rows.includes(item)));
          setSelectedRows([]);
          setRowSelection({});
        },
      });
    },
    [onBulkDelete, onRowDelete]
  );

  // Handle CSV import success
  const handleCSVImportSuccess = useCallback((data: any) => {
    // If the import was processed directly (not as a batch job)
    if (data.success && !data.jobId) {
      // In a real app, you would refresh the table data here
      console.log("CSV import successful, refreshing data...");
    }
  }, []);

  // Open preview modal
  const openPreviewModal = useCallback((row: T) => {
    setCurrentRow(row);
    setIsPreviewModalOpen(true);
  }, []);

  // Open Bull Board in new tab
  const openBullBoard = useCallback(() => {
    window.open(BATCH_PROCESSOR_URL, "_blank");
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setRowSelection({});
    setSelectedRows([]);
  }, []);

  // Render custom actions
  const renderCustomActions = useCallback(() => {
    if (!customActions) return null;

    if (typeof customActions === "function") {
      return customActions({
        selectedRows,
        onActionComplete: clearSelection,
      });
    }

    return customActions;
  }, [customActions, selectedRows, clearSelection]);

  // Configure table options
  const tableOptions: MRT_TableOptions<T> = {
    columns,
    data: tableData,
    enableStickyHeader: true,
    enableEditing: enableEdit,
    enableColumnOrdering: enableColumnOrdering,
    enableGlobalFilter: enableFiltering,
    enableRowSelection: enableRowSelection,
    enablePagination: enablePagination,
    enablePinning: true,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
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
        right: ["actions"], //pin built-in row actions display column to right by default
      },
    },
    renderRowActions: ({ row }) => (
      <Flex gap="md">
        {enablePreview && (
          <ActionIcon
            size="sm"
            variant="subtle"
            color="blue"
            onClick={() => openPreviewModal(row.original)}
          >
            <IconEye />
          </ActionIcon>
        )}
        {enableEdit && (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={() => {
              setCurrentRow(row.original);
              setIsEditModalOpen(true);
            }}
          >
            <IconEdit />
          </ActionIcon>
        )}
        {enableDelete && (
          <ActionIcon
            size="sm"
            variant="subtle"
            color="red"
            onClick={() => handleDeleteRow(row.original)}
          >
            <IconTrash />
          </ActionIcon>
        )}
      </Flex>
    ),
    renderTopToolbarCustomActions: () => (
      <Group>
        {enableCreate && (
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Add New
          </Button>
        )}

        {/* CSV Import Button */}
        {enableCSVImport && (
          <Button
            leftSection={<IconUpload size={16} />}
            variant="light"
            onClick={() => setIsCSVImportModalOpen(true)}
          >
            Import CSV
          </Button>
        )}

        {/* Bull Board Button */}
        {enableCSVImport && (
          <Button
            leftSection={<IconExternalLink size={16} />}
            variant="subtle"
            onClick={openBullBoard}
          >
            Job Dashboard
          </Button>
        )}

        {/* Show Delete button when rows are selected */}
        {selectedRows.length > 0 && enableDelete && (
          <Button
            leftSection={<IconTrash size={16} />}
            color="red"
            variant="light"
            onClick={() => handleBulkDelete(selectedRows)}
          >
            Delete Selected ({selectedRows.length})
          </Button>
        )}

        {/* Bulk Actions Menu */}
        {selectedRows.length > 0 && bulkActions.length > 0 && (
          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <Button variant="light">
                Actions
                <IconDotsVertical size={16} style={{ marginLeft: 5 }} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {bulkActions.map((action, index) => (
                <Menu.Item
                  key={index}
                  leftSection={action.icon}
                  onClick={() => {
                    action.onClick(selectedRows);
                    // Optionally clear selection after action
                    // clearSelection()
                  }}
                  color={action.color}
                >
                  {action.label}
                </Menu.Item>
              ))}
              {selectedRows.length > 0 && (
                <Menu.Item
                  leftSection={<IconTrash size={16} />}
                  onClick={clearSelection}
                  color="gray"
                >
                  Clear Selection
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        )}

        {/* Custom Actions */}
        {renderCustomActions()}
      </Group>
    ),
    renderEmptyRowsFallback: () => (
      <div className="p-4 text-center">
        {emptyState || <Text c="dimmed">No records found</Text>}
      </div>
    ),
    mantineTableProps: {
      highlightOnHover: false,
      striped: true,
      withColumnBorders: true,
      withRowBorders: true,
      withTableBorder: true,
    },
  };

  const table = useMantineReactTable(tableOptions);

  // Update selectedRows when rowSelection changes
  React.useEffect(() => {
    const selectedRowsData = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);
    setSelectedRows(selectedRowsData);

    if (onSelectionChange) {
      onSelectionChange(selectedRowsData);
    }
  }, [rowSelection, table, onSelectionChange]);

  // Render custom preview
  const renderCustomPreview = () => {
    if (!customPreview || !currentRow) return null;

    if (typeof customPreview === "function") {
      return customPreview({
        data: currentRow,
        onClose: () => {
          setIsPreviewModalOpen(false);
          setCurrentRow(null);
        },
      });
    }

    return customPreview;
  };

  return (
    <ModalsProvider>
      <Title order={3} mb="md">
        {title}
      </Title>

      <MantineReactTable table={table} />

      {/* Create Modal */}
      <Modal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Item"
        size="lg"
      >
        <FastroDataEditor
          data={createTemplate as T}
          columnDef={columnVariants}
          dropdownOptions={dropdownOptions}
          onSubmit={handleCreateRow}
          onCancel={() => setIsCreateModalOpen(false)}
          submitLabel="Create"
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentRow(null);
        }}
        title="Edit Item"
        size="lg"
      >
        {currentRow && (
          <FastroDataEditor
            data={currentRow}
            columnDef={columnVariants}
            dropdownOptions={dropdownOptions}
            onSubmit={handleUpdateRow}
            onCancel={() => {
              setIsEditModalOpen(false);
              setCurrentRow(null);
            }}
            submitLabel="Update"
          />
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal
        opened={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setCurrentRow(null);
        }}
        title="Item Details"
        size="lg"
      >
        {customPreview
          ? renderCustomPreview()
          : currentRow && (
              <FastroDataPreview
                data={currentRow}
                columnVariants={columnVariants}
                title=""
                layout="card"
                excludeFields={previewExcludeFields}
                labelMap={previewLabelMap}
              />
            )}
      </Modal>

      {/* CSV Import Modal */}
      <CSVImportModal
        opened={isCSVImportModalOpen}
        onClose={() => setIsCSVImportModalOpen(false)}
        onImportSuccess={handleCSVImportSuccess}
      />
    </ModalsProvider>
  );
}

export default FastroTable;
