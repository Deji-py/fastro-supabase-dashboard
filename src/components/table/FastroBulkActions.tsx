"use client";

import type React from "react";
import { Button, Group, Menu, ActionIcon, Text } from "@mantine/core";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";

export type BulkAction<T> = {
  label: string;
  icon?: React.ReactNode;
  color?: string;
  onClick: (selectedRows: T[]) => void;
};

type FastroBulkActionsProps<T> = {
  selectedRows: T[];
  onClearSelection: () => void;
  onBulkDelete?: (selectedRows: T[]) => void;
  actions?: BulkAction<T>[];
};

function FastroBulkActions<T>({
  selectedRows,
  onClearSelection,
  onBulkDelete,
  actions = [],
}: FastroBulkActionsProps<T>) {
  if (selectedRows.length === 0) {
    return null;
  }

  return (
    <Group align="apart" p="xs" bg="gray.0" style={{ borderRadius: "4px" }}>
      <Group gap="xs">
        <Text size="sm" fw={500}>
          {selectedRows.length} item{selectedRows.length !== 1 ? "s" : ""}{" "}
          selected
        </Text>
        <Button variant="subtle" size="xs" onClick={onClearSelection}>
          Clear
        </Button>
      </Group>

      <Group gap="xs">
        {onBulkDelete && (
          <Button
            leftSection={<IconTrash size={16} />}
            color="red"
            variant="light"
            size="xs"
            onClick={() => onBulkDelete(selectedRows)}
          >
            Delete
          </Button>
        )}

        {actions.length > 0 && (
          <>
            {actions.slice(0, 2).map((action, index) => (
              <Button
                key={index}
                leftSection={action.icon}
                color={action.color}
                variant="light"
                size="xs"
                onClick={() => action.onClick(selectedRows)}
              >
                {action.label}
              </Button>
            ))}

            {actions.length > 2 && (
              <Menu position="bottom-end" withinPortal>
                <Menu.Target>
                  <ActionIcon>
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  {actions.slice(2).map((action, index) => (
                    <Menu.Item
                      key={index}
                      leftSection={action.icon}
                      onClick={() => action.onClick(selectedRows)}
                      color={action.color}
                    >
                      {action.label}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </>
        )}
      </Group>
    </Group>
  );
}

export default FastroBulkActions;
