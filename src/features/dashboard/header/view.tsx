"use client";

import React, { useState } from "react";
import { Flex, Group, Popover, Text } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useMantineColorScheme } from "@mantine/core";

import Fastro_RichSearch from "@/components/molecules/blocks/Fastro_RichSearch";
import Fastro_HeaderActionIcons, {
  ActionIconItem,
} from "@/components/molecules/blocks/Fastro_HeaderActionIcons";
import FastroSearchItem from "@/utils/FastroSearchItem";
import { User as FastroUser } from "@/types";
import Fastro_UserGreeting from "@/components/molecules/blocks/Fastro_UserGreeting";
import { Bell, DollarSign, Mail, PenBox } from "lucide-react";
import NotificationList from "@/features/notifications/NotificationDropdown";
import { Activity, useNotifications } from "@/providers/notification-provider";

function HeaderView() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const [activitiesOpened, setActivitiesOpened] = useState(false);
  const { notifications } = useNotifications();

  const allActivities = notifications.groups.flatMap(
    (group) => group.activities
  );

  const actionIcons: ActionIconItem[] = [
    {
      icon: (
        <Popover
          width={500}
          position="bottom-end"
          withArrow
          shadow="md"
          opened={activitiesOpened}
          onChange={setActivitiesOpened}
          trapFocus={false}
          withinPortal
          withOverlay
        >
          <Popover.Target>
            <Bell
              size={20}
              style={{ cursor: "pointer" }}
              onClick={() => setActivitiesOpened((o) => !o)}
            />
          </Popover.Target>
          <Popover.Dropdown>
            <NotificationList activities={allActivities} />
          </Popover.Dropdown>
        </Popover>
      ),
      label: "activities",
      color: "violet",
      onClick: () => {}, // no external click now
      variant: "light",
      notification:
        notifications.totalUnseen > 0
          ? { count: notifications.totalUnseen }
          : undefined,
    },
    {
      icon: <Mail size={20} />,
      label: "Send Mail",
      color: "violet",
      onClick: () => console.log("Liked!"),
      variant: "light",
    },
    {
      icon: <PenBox size={20} />,
      label: "Blogs",
      onClick: () => window.open("https://github.com", "_blank"),
      variant: "light",
    },
    {
      icon: <DollarSign size={20} />,
      label: "Earnings",
      onClick: () => console.log("Open docs"),
      variant: "light",
    },
    {
      icon: isDark ? <IconSun size={20} /> : <IconMoon size={20} />,
      label: isDark ? "Light mode" : "Dark mode",
      onClick: () => toggleColorScheme(),
      variant: "light",
    },
  ];

  return (
    <Flex align="center" justify="space-between" w={{ lg: "100%" }}>
      <Fastro_RichSearch<FastroUser>
        renderItem={FastroSearchItem}
        placeholder="Search users..."
        tables={[
          {
            name: "users",
            label: "Users",
            columns: ["firstname", "lastname"],
          },
        ]}
      />
      <Group gap={30}>
        <Fastro_HeaderActionIcons icons={actionIcons} size="lg" spacing="md" />
        <Fastro_UserGreeting />
      </Group>
    </Flex>
  );
}

export default HeaderView;
