import { UserData } from "@/app/dashboard/users/page";
import { CustomPreviewProps } from "@/components/table/FastroTable"; // Updated import
import {
  Card,
  Avatar,
  Text,
  Group,
  Button,
  Badge,
  Divider,
  Stack,
  Flex,
  Menu,
  ActionIcon,
  Table,
  ScrollArea,
} from "@mantine/core";
import {
  IconDotsVertical,
  IconPhone,
  IconMail,
  IconBuildingSkyscraper,
  IconWorld,
  IconUserEdit,
  IconUserX,
  IconTrash,
  IconEye,
} from "@tabler/icons-react";
import moment from "moment";
import React from "react";

export interface UserAction {
  label: string;
  icon?: React.ReactNode;
  color?: string;
  onClick: (data: UserData) => void;
}

export interface ExtendedUserDataPreviewProps
  extends CustomPreviewProps<UserData> {
  actions?: UserAction[]; // optional custom actions
}

type DefaultSctions = {
  onClose: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onPreview: () => void;
};

const defaultActions = (
  data: UserData,
  action: DefaultSctions
): UserAction[] => [
  {
    label: "Suspend",
    color: "yellow",
    icon: <IconUserX size={16} />,
    onClick: () => console.log("suspend user"),
  },
  {
    label: "Delete",
    color: "red",
    icon: <IconTrash size={16} />,
    onClick: action.onDelete,
  },
];

function UserDataPreview({
  data,
  onClose,
  actions,
  onDelete,
  onEdit,
  onPreview,
}: ExtendedUserDataPreviewProps) {
  const mergedActions =
    actions || defaultActions(data, { onDelete, onEdit, onPreview, onClose });

  return (
    <Card radius="md" withBorder padding="xl" w={"100%"}>
      {/* Header */}
      <Flex justify="space-between" align="center" mb="md">
        <Group>
          <Avatar
            src={data.profile_pic?.src || undefined}
            size={70}
            radius="xl"
          >
            {!data.profile_pic?.src && data.firstname ? data.firstname[0] : ""}
          </Avatar>
          <Stack gap={2}>
            <Text fw={700} size="lg">
              {data.firstname} {data.lastname}
            </Text>
            <Text size="sm" c="dimmed">
              {data.email}
            </Text>
          </Stack>
        </Group>

        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <IconDotsVertical size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {mergedActions.map((action, idx) => (
              <Menu.Item
                key={idx}
                leftSection={action.icon}
                color={action.color}
                onClick={() => action.onClick(data)}
              >
                {action.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Flex>

      {/* Basic Info */}
      <Divider my="sm" />
      <Stack gap="xs" mb="md">
        <Group gap="xs">
          <IconWorld size={18} />
          <Text size="sm">
            {data.user_business_info?.country || "No country"}
          </Text>
        </Group>
        <Group gap="xs">
          <Text size="sm" fw={500}>
            Credits Balance:
          </Text>
          <Badge>{data.credits}</Badge>
        </Group>
        <Group gap="xs">
          <Text size="sm" fw={500}>
            Status:
          </Text>
          <Badge variant="light" color="blue">
            Active
          </Badge>
        </Group>
        <Group gap="xs">
          <Text size="sm" fw={500}>
            Last Login:
          </Text>
          <Text size="sm" c="dimmed">
            {moment(data.created_at).format("lll")}
          </Text>
        </Group>
      </Stack>

      {/* More Details */}
      <Divider my="sm" label="User Details" labelPosition="center" />
      <Stack gap="xs">
        <Group gap="xs">
          <IconBuildingSkyscraper size={18} />
          <Text size="sm">
            {data.user_business_info?.company_name || "No company"}
          </Text>
        </Group>

        <Group gap="xs">
          <IconPhone size={18} />
          <Text size="sm">{data.mobile || "No mobile"}</Text>
        </Group>

        <Group justify="space-between" gap="xs">
          <Text size="sm" fw={500}>
            Date of Registration:
          </Text>
          <Text size="sm" c="dimmed">
            {moment(data.created_at).format("lll")}
          </Text>
        </Group>

        <Group justify="space-between" gap="xs">
          <Text size="sm" fw={500}>
            Total Amount Spent:
          </Text>
          <Text size="sm" c="dark">
            $500.00
          </Text>
        </Group>

        <Group justify="space-between" gap="xs">
          <Text size="sm" fw={500}>
            Total Credits Purchased:
          </Text>
          <Text size="sm" c="dark">
            1000
          </Text>
        </Group>

        <Group justify="space-between" gap="xs">
          <Text size="sm" fw={500}>
            Total Data Exported:
          </Text>
          <Text size="sm" c="dark">
            300 records
          </Text>
        </Group>

        <Group justify="space-between" gap="xs">
          <Text size="sm" fw={500}>
            Balance Credits:
          </Text>
          <Text size="sm" c="dark">
            {data.credits}
          </Text>
        </Group>

        <Group justify="space-between" gap="xs">
          <Text size="sm" fw={500}>
            Total Lists Created:
          </Text>
          <Text size="sm" c="dark">
            5
          </Text>
        </Group>
      </Stack>

      {/* Data In Lists */}
      <Divider my="md" label="Lists Data" labelPosition="center" />
      <ScrollArea h={150}>
        <Table withColumnBorders highlightOnHover striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>List Name</Table.Th>
              <Table.Th>Records</Table.Th>
              <Table.Th>Created</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Clients USA</Table.Td>
              <Table.Td>120</Table.Td>
              <Table.Td>April 10, 2024</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Retail Leads</Table.Td>
              <Table.Td>85</Table.Td>
              <Table.Td>March 5, 2024</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td>Manufacturers</Table.Td>
              <Table.Td>55</Table.Td>
              <Table.Td>Feb 20, 2024</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {/* Close Button */}
      <Button fullWidth mt="xl" variant="light" onClick={onClose}>
        Close Preview
      </Button>
    </Card>
  );
}

export default UserDataPreview;
