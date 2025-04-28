import React from "react";
import { Drawer, Modal } from "@mantine/core";
import { type ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import { CustomPreviewProps } from "./FastroTable";
import FastroDataEditor from "./FastroDataEditor";
import MemoizedFastroDataPreview from "./FastroDataPreview";
import CSVImportModal from "./CSVImportModal";

interface TableModalsProps<T> {
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isPreviewModalOpen: boolean;
  isCSVImportModalOpen: boolean;
  currentRow: T | null;
  createTemplate: T;
  columnVariants: ColumnVariantMap<T>;
  dropdownOptions: Array<{
    field: string;
    options: Array<{ value: string; label: string }>;
  }>;
  handleCreateRow: (values: any) => Promise<void>;
  handleUpdateRow: (values: any) => Promise<void>;
  handleCSVImportSuccess: (data: any) => void;
  setIsCreateModalOpen: (value: boolean) => void;
  setIsEditModalOpen: (value: boolean) => void;
  setIsPreviewModalOpen: (value: boolean) => void;
  setIsCSVImportModalOpen: (value: boolean) => void;
  setCurrentRow: (row: T | null) => void;
  customPreview?:
    | React.ReactNode
    | ((props: CustomPreviewProps<T>) => React.ReactNode);
  previewExcludeFields: (keyof T)[];
  previewLabelMap: Partial<Record<keyof T, string>>;
  handleDeleteRow: (row: T) => void; // Add delete handler
  handlePreviewRow: (row: T) => void;
}

function TableModals<T extends object>({
  isCreateModalOpen,
  isEditModalOpen,
  isPreviewModalOpen,
  isCSVImportModalOpen,
  currentRow,
  createTemplate,
  columnVariants,
  dropdownOptions,
  handleCreateRow,
  handleUpdateRow,
  handleCSVImportSuccess,
  setIsCreateModalOpen,
  setIsEditModalOpen,
  setIsPreviewModalOpen,
  setIsCSVImportModalOpen,
  setCurrentRow,
  customPreview,
  previewExcludeFields,
  previewLabelMap,
  handleDeleteRow,
  handlePreviewRow,
}: TableModalsProps<T>) {
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
        onDelete: () => handleDeleteRow(currentRow), // Pass delete action
        onEdit: () => {
          setIsEditModalOpen(true);
          setCurrentRow(currentRow);
        }, // Pass edit action
        onPreview: () => handlePreviewRow(currentRow), // Pass preview action
      });
    }

    return customPreview;
  };

  return (
    <>
      {/* Create Modal */}
      <Modal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Item"
        size="lg"
      >
        <FastroDataEditor
          data={createTemplate}
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
      <Drawer
        position="right"
        opened={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setCurrentRow(null);
        }}
        size="lg"
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        {customPreview
          ? renderCustomPreview()
          : currentRow && (
              <MemoizedFastroDataPreview
                data={currentRow}
                columnVariants={columnVariants}
                title=""
                layout="table"
                excludeFields={previewExcludeFields as any}
                labelMap={previewLabelMap}
              />
            )}
      </Drawer>

      {/* CSV Import Modal */}
      <CSVImportModal
        opened={isCSVImportModalOpen}
        onClose={() => setIsCSVImportModalOpen(false)}
        onImportSuccess={handleCSVImportSuccess}
      />
    </>
  );
}

export default React.memo(TableModals) as typeof TableModals;
