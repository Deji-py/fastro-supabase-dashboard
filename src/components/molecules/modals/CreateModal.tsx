"use client";
import React from "react";
import { Modal } from "@mantine/core";
import FastroDataEditor from "@/components/table/FastroDataEditor";
import { CreateModalProps } from "@/types";

function CreateModalComponent<T extends object>({
  isOpen,
  onClose,
  onSubmit,
  columnVariants,
  createTemplate = {} as Partial<T>,
  dropdownOptions,
}: CreateModalProps<T>) {
  const handleSubmit = async (values: any) => {
    await onSubmit(values);
  };

  console.log(
    "rerendered create modal",
    isOpen,
    onClose,
    columnVariants,
    createTemplate,
    dropdownOptions
  );

  return (
    <Modal opened={isOpen} onClose={onClose} title="Create New Item" size="lg">
      <FastroDataEditor
        data={createTemplate as T}
        columnDef={columnVariants}
        dropdownOptions={dropdownOptions}
        onSubmit={handleSubmit}
        onCancel={onClose}
        submitLabel="Create"
      />
    </Modal>
  );
}

// ⬇️ Wrap with React.memo!
export const CreateModal = React.memo(
  CreateModalComponent
) as typeof CreateModalComponent;
