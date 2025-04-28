import React from "react";
import { Modal } from "@mantine/core";

import FastroDataEditor from "@/components/table/FastroDataEditor";
import { EditModalProps } from "@/types";

function EditModal<T extends object>({
  isOpen,
  onClose,
  currentRow,
  onSubmit,
  columnVariants,
  dropdownOptions,
}: EditModalProps<T>) {
  const handleSubmit = async (values: any) => {
    if (!currentRow) return;
    await onSubmit(values, currentRow);
  };
  console.log("reremdered edit modal");
  return (
    <Modal opened={isOpen} onClose={onClose} title="Edit Item" size="lg">
      {currentRow && (
        <FastroDataEditor
          data={currentRow}
          columnDef={columnVariants}
          dropdownOptions={dropdownOptions}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Update"
        />
      )}
    </Modal>
  );
}

export const MmemoizedEditModal = React.memo(EditModal);
