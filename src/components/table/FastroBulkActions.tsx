import React from "react";
import { Menu, Button } from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { BulkAction } from "@/types/table_types";

interface TableBulkActionsProps<T> {
  selectedRows: T[];
  bulkActions: BulkAction<T>[];
  clearSelection: () => void;
}

export function TableBulkActions<T>({
  selectedRows,
  bulkActions,
  clearSelection,
}: TableBulkActionsProps<T>) {
  if (selectedRows.length === 0) return null;

  return (
    <Menu position="bottom-end" withinPortal>
      <Menu.Target>
        <Button variant="light" rightSection={<IconDotsVertical size={16} />}>
          Actions
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
  );
}
