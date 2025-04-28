import React, { useCallback } from "react";
import { Modal } from "@mantine/core";

import MemoizedFastroDataPreview from "@/components/table/FastroDataPreview";
import { PreviewModalProps } from "@/types";

function PreviewModal<T extends object>({
  isOpen,
  onClose,
  currentRow,
  customPreview,
  columnVariants,
  previewExcludeFields = [],
  previewLabelMap = {},
}: PreviewModalProps<T>) {
  const renderCustomPreview = useCallback(() => {
    if (!customPreview || !currentRow) return null;

    if (typeof customPreview === "function") {
      return customPreview({
        data: currentRow,
        onClose,
      });
    }

    return customPreview;
  }, [customPreview, currentRow, onClose]);
  console.log("reremdered preview modal");
  return (
    <Modal opened={isOpen} onClose={onClose} title="Item Details" size="lg">
      {customPreview
        ? renderCustomPreview()
        : currentRow && (
            <MemoizedFastroDataPreview
              data={currentRow}
              columnVariants={columnVariants}
              title=""
              layout="card"
              excludeFields={previewExcludeFields as any}
              labelMap={previewLabelMap}
            />
          )}
    </Modal>
  );
}

export const MmemoizedPreviewModal = React.memo(PreviewModal);
