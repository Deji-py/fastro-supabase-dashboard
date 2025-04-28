import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Menu,
  Text,
  Title,
} from "@mantine/core";
import {
  IconEdit,
  IconEye,
  IconTrash,
  IconPlus,
  IconUpload,
  IconExternalLink,
  IconDotsVertical,
} from "@tabler/icons-react";
import { memo } from "react";
import { MRT_RowData } from "mantine-react-table";

interface TopToolbarCustomActionsProps<T> {
  enableCreate: boolean;
  enableCSVImport: boolean;
  selectedRows: T[]; // Use T for selectedRows
  bulkActions: any; // Use T in BulkAction array
  renderCustomActions: any;
  handleBulkDelete: any; // Use T here as well
  openBullBoard: () => void;
  setIsCreateModalOpen: (open: boolean) => void;
  setIsCSVImportModalOpen: (open: boolean) => void;
  clearSelection: () => void;
  title?: string;
}

export interface CustomRowAction<T> {
  label: string;
  icon?: React.ReactNode;
  color?: string;
  onClick: (row: T) => void;
}

interface RowActionsProps<T> {
  row: {
    original: T;
  };
  enablePreview?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  customRowActions?: CustomRowAction<T>[]; // NEW: extra actions
  openPreviewModal?: (row: any) => void;
  handleDeleteRow?: (row: any) => void;
  setIsEditModalOpen?: (open: boolean) => void;
  setCurrentRow?: (row: any) => void;
}

const RowActions = memo(
  <T,>({
    row,
    enablePreview,
    enableEdit,
    enableDelete,
    customRowActions = [],
    openPreviewModal,
    handleDeleteRow,
    setIsEditModalOpen,
    setCurrentRow,
  }: RowActionsProps<T>) => {
    const hasDefaultActions = enablePreview || enableEdit || enableDelete;
    const hasCustomActions = customRowActions.length > 0;

    if (!hasDefaultActions && !hasCustomActions) return null;

    return (
      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <ActionIcon variant="subtle">
            <IconDotsVertical size={18} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {enablePreview && (
            <Menu.Item
              leftSection={<IconEye size={16} />}
              onClick={() => openPreviewModal?.(row.original)}
            >
              Preview
            </Menu.Item>
          )}
          {enableEdit && (
            <Menu.Item
              leftSection={<IconEdit size={16} />}
              onClick={() => {
                setCurrentRow?.(row.original);
                setIsEditModalOpen?.(true);
              }}
            >
              Edit
            </Menu.Item>
          )}
          {enableDelete && (
            <Menu.Item
              leftSection={<IconTrash size={16} />}
              color="red"
              onClick={() => handleDeleteRow?.(row.original)}
            >
              Delete
            </Menu.Item>
          )}

          {/* Divider if both default and custom actions exist */}
          {hasDefaultActions && hasCustomActions && <Menu.Divider />}

          {customRowActions.map((action, index) => (
            <Menu.Item
              key={index}
              leftSection={action.icon}
              onClick={() => action.onClick(row.original)}
              color={action.color}
            >
              {action.label}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>
    );
  }
);

// Top Toolbar Custom Actions Component
const TopToolbarCustomActions: React.FC<
  TopToolbarCustomActionsProps<MRT_RowData>
> = ({
  enableCreate,
  enableCSVImport,
  selectedRows,
  bulkActions,
  renderCustomActions,
  handleBulkDelete,
  openBullBoard,
  setIsCreateModalOpen,
  setIsCSVImportModalOpen,
  clearSelection,
  title,
}) => (
  <Group>
    {title && !enableCreate && !enableCSVImport && (
      <Title order={3} mb="md">
        {title}
      </Title>
    )}
    {enableCreate && (
      <Button
        leftSection={<IconPlus size={16} />}
        onClick={() => setIsCreateModalOpen(true)}
      >
        Add New
      </Button>
    )}

    {enableCSVImport && (
      <Button
        leftSection={<IconUpload size={16} />}
        variant="light"
        onClick={() => setIsCSVImportModalOpen(true)}
      >
        Import CSV
      </Button>
    )}

    {enableCSVImport && (
      <Button
        leftSection={<IconExternalLink size={16} />}
        variant="subtle"
        onClick={openBullBoard}
      >
        Job Dashboard
      </Button>
    )}

    {selectedRows.length > 0 && (
      <Button
        leftSection={<IconTrash size={16} />}
        color="red"
        variant="light"
        onClick={() => handleBulkDelete(selectedRows)}
      >
        Delete Selected ({selectedRows.length})
      </Button>
    )}

    {selectedRows.length > 0 && bulkActions.length > 0 && (
      <Menu position="bottom-end" withinPortal>
        <Menu.Target>
          <Button variant="light">
            Actions
            <IconDotsVertical size={16} style={{ marginLeft: 5 }} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {bulkActions.map((action: any, index: any) => (
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

    {renderCustomActions()}
  </Group>
);

// Empty Rows Fallback Component
const EmptyRowsFallback = memo(() => (
  <div className="p-4 text-center">
    <Text c="dimmed">No records found</Text>
  </div>
));

export { EmptyRowsFallback, RowActions, TopToolbarCustomActions };
