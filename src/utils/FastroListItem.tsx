import React from "react";
import {
  Group,
  Avatar,
  Text,
  Badge,
  Box,
  ActionIcon,
  ThemeIcon,
  rem,
  useMantineTheme,
  Flex,
} from "@mantine/core";
import {
  IconChevronRight,
  IconNotification,
  IconUser,
} from "@tabler/icons-react";
import { BellDot } from "lucide-react";

// Define a common type for list data items
export type FastroListItemType = {
  id: string;
  title: string;
  subtitle?: string;
  rightLabel?: string;
  badge?: string;
  profile_pic?: string;
  icon?: React.ReactNode;
  image?: string;
  color?: string;
  actionIcon?: React.ReactNode;
};

// Define supported list display variants
export type FastroListVariant =
  | "icon-left"
  | "avatar-left"
  | "minimal"
  | "with-badge"
  | "right-label"
  | "highlight"
  | "inline"
  | "outlined"
  | "image-card"
  | "custom-action"
  | "with-icon-and-label"
  | "notification"
  | "avatar-left-with-label";

// Render a single list item based on variant
function FastroListItem({
  item,
  variant = "minimal",
}: {
  item: FastroListItemType;
  variant?: FastroListVariant;
}) {
  const theme = useMantineTheme();

  switch (variant) {
    case "icon-left":
      return (
        <Group justify="space-between">
          <Group>
            <ThemeIcon variant="light" color={item.color}>
              {item.icon || <IconUser size="1rem" />}
            </ThemeIcon>
            <div>
              <Text fw={500}>{item.title}</Text>
              {item.subtitle && (
                <Text size="xs" c="dimmed">
                  {item.subtitle}
                </Text>
              )}
            </div>
          </Group>
        </Group>
      );

    case "avatar-left":
      return (
        <Group justify="space-between">
          <Group>
            <Avatar src={item.profile_pic} alt="profile_pic" />
            <div>
              <Text fw={500}>{item.title}</Text>
              {item.subtitle && (
                <Text size="xs" c="dimmed">
                  {item.subtitle}
                </Text>
              )}
            </div>
          </Group>
        </Group>
      );

    case "avatar-left-with-label":
      return (
        <Group justify="space-between">
          <Group>
            <Avatar src={item.profile_pic} alt="avatar" />
            <div>
              <Text size="sm" fw={500}>
                {item.title}
              </Text>
              {item.subtitle && (
                <Text size="xs" c="dimmed">
                  {item.subtitle}
                </Text>
              )}
            </div>
          </Group>
          <Text fw={700}>{item.rightLabel}</Text>
        </Group>
      );

    case "with-badge":
      return (
        <Group justify="space-between">
          <div>
            <Text fw={500}>{item.title}</Text>
            {item.subtitle && (
              <Text size="xs" c="dimmed">
                {item.subtitle}
              </Text>
            )}
          </div>
          {item.badge && <Badge color="green">{item.badge}</Badge>}
        </Group>
      );

    case "right-label":
      return (
        <Group justify="space-between">
          <div>
            <Text fw={600}>{item.title}</Text>
            {item.subtitle && (
              <Text size="xs" c="dimmed">
                {item.subtitle}
              </Text>
            )}
          </div>
          <Text fw={700}>{item.rightLabel}</Text>
        </Group>
      );

    case "highlight":
      return (
        <Box bg="blue.0" p="xs">
          <Text fw={600} c={item.color}>
            {item.title}
          </Text>
          {item.subtitle && <Text size="xs">{item.subtitle}</Text>}
        </Box>
      );

    case "inline":
      return (
        <Group>
          <Text>{item.title}</Text>
          {item.rightLabel && <Text c="gray">{item.rightLabel}</Text>}
        </Group>
      );

    case "outlined":
      return (
        <Box p="md" style={{ border: "1px solid #ddd", borderRadius: rem(6) }}>
          <Text fw={500}>{item.title}</Text>
          {item.subtitle && (
            <Text size="xs" c="dimmed">
              {item.subtitle}
            </Text>
          )}
        </Box>
      );

    case "image-card":
      return (
        <Group>
          <Avatar src={item.image} radius="md" size="lg" />
          <div>
            <Text fw={500}>{item.title}</Text>
            {item.subtitle && (
              <Text size="xs" c="dimmed">
                {item.subtitle}
              </Text>
            )}
          </div>
        </Group>
      );

    case "custom-action":
      return (
        <Group justify="space-between">
          <div>
            <Text fw={500}>{item.title}</Text>
            {item.subtitle && (
              <Text size="xs" c="dimmed">
                {item.subtitle}
              </Text>
            )}
          </div>
          {item.actionIcon || (
            <ActionIcon variant="light" color={theme.primaryColor}>
              <IconChevronRight />
            </ActionIcon>
          )}
        </Group>
      );
    case "with-icon-and-label":
      return (
        <Group justify="space-between">
          <Group>
            <ThemeIcon size="xl" variant="light" color={item.color}>
              {item.icon || <IconUser size="2rem" />}
            </ThemeIcon>
            <div>
              <Text fw={500}>{item.title}</Text>
              {item.subtitle && (
                <Text size="xs" c="dimmed">
                  {item.subtitle}
                </Text>
              )}
            </div>
          </Group>
          <Text fw={700}>{item.rightLabel}</Text>
        </Group>
      );
    case "notification":
      return (
        <Group align="start" justify="space-between">
          <Flex gap={10}>
            <ThemeIcon
              size="md"
              radius="md"
              variant="transparent"
              color={theme.primaryColor}
            >
              {item.icon || <BellDot size="1.5rem" />}
            </ThemeIcon>
            <div>
              <Text fw={400} lineClamp={1} size="sm">
                {item.title}
              </Text>
              <Text fw={400} lineClamp={2} c="dimmed" size="sm">
                {item.subtitle}
              </Text>
            </div>
          </Flex>
          <Text size="sm" c={"dimmed"}>
            {item.rightLabel}
          </Text>
        </Group>
      );

    default:
      return (
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
        </div>
      );
  }
}

export default FastroListItem;
