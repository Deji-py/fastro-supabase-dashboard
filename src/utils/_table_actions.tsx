import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { BATCH_PROCESSOR_URL } from "@/app_meta/constants";

// Function to handle individual row deletion
export const handleDeleteRow = <T extends object>(
  row: T,
  onRowDelete?: (row: T) => Promise<void> | void
) => {
  modals.openConfirmModal({
    title: "Delete Confirmation",
    children: (
      <Text>
        Are you sure you want to delete this item? This action cannot be undone.
      </Text>
    ),
    labels: { confirm: "Delete", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onConfirm: async () => {
      if (onRowDelete) await onRowDelete(row);
    },
  });
};

// Function to handle bulk deletion of rows
export const handleBulkDelete = <T extends object>(
  rows: T[],
  onBulkDelete?: (rows: T[]) => Promise<void> | void,
  onRowDelete?: (row: T) => Promise<void> | void,
  clearSelection?: () => void
) => {
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
      } else if (onRowDelete) {
        for (const row of rows) {
          await onRowDelete(row);
        }
      }
      if (clearSelection) clearSelection();
    },
  });
};

// Function to open the BullBoard for batch processing
export const openBullBoard = () => {
  window.open(BATCH_PROCESSOR_URL, "_blank");
};

// Render custom actions
export const renderCustomActions = (
  customActions: any,
  selectedRows: any,
  clearSelection: () => void
) => {
  if (!customActions) return null;

  if (typeof customActions === "function") {
    return customActions({
      selectedRows,
      onActionComplete: clearSelection,
    });
  }

  return customActions;
};
