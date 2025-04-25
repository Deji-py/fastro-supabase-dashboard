"use client";

import React, { useState } from "react";
import {
  Box,
  Text,
  Group,
  Menu,
  Avatar,
  useMantineTheme,
  Paper,
  Skeleton,
} from "@mantine/core";
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useFastroAuth } from "@/lib/Fastro";
import { useRouter } from "next/navigation";

interface Fastro_UserGreetingProps {
  variant?: "header" | "sidebar";
  user?: {
    email?: string;
    user_metadata?: {
      full_name?: string;
      name?: string;
      avatar_url?: string;
    };
  };
  menuItems?: Array<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }>;
  onLogout?: () => void;
}

export default function Fastro_UserGreeting({
  variant = "header",
  menuItems = [],
}: Fastro_UserGreetingProps) {
  const theme = useMantineTheme();
  const [menuOpened, setMenuOpened] = useState(false);
  const { user, LOGOUT } = useFastroAuth();
  const router = useRouter();

  const role = user?.role || null;
  const userEmail = user?.email || null;
  const avatarUrl = user?.profile_pic;
  const isSidebar = variant === "sidebar";

  const handleLogout = () => {
    LOGOUT(() => router.push("/login"));
  };

  if (!user) {
    return (
      <Paper
        component="button"
        px={isSidebar ? "8px" : "8px"}
        radius="md"
        style={{
          cursor: "pointer",
          width: isSidebar ? "100%" : "auto",
          border: "none",
        }}
      >
        <Group
          p={isSidebar ? "sm" : "0px"}
          style={{
            border: isSidebar ? `1px solid ${theme.colors.gray[2]}` : "none",
            borderRadius: "10px",
            background: isSidebar ? theme.colors.gray[0] : "transparent",
          }}
          gap={isSidebar ? "md" : "xs"}
          wrap="nowrap"
        >
          <Skeleton height={36} circle />
          <Box visibleFrom="sm">
            <Skeleton height={10} width={100} mt={4} radius="xl" />
            <Skeleton height={8} width={150} mt={6} radius="xl" />
          </Box>
        </Group>
      </Paper>
    );
  }

  return (
    <Menu
      width={260}
      position={isSidebar ? "right" : "bottom-end"}
      transitionProps={{ transition: "pop-top-right" }}
      onOpen={() => setMenuOpened(true)}
      onClose={() => setMenuOpened(false)}
      withinPortal
      shadow="md"
    >
      <Menu.Target>
        <Paper
          component="button"
          px={isSidebar ? "8px" : "8px"}
          radius="md"
          style={{
            cursor: "pointer",
            width: isSidebar ? "100%" : "auto",
            border: "none",
          }}
        >
          <Group
            p={isSidebar ? "sm" : "0px"}
            style={{
              border: isSidebar ? `1px solid ${theme.colors.gray[2]}` : "none",
              borderRadius: "10px",
              background: isSidebar ? theme.colors.gray[0] : "transparent",
            }}
            gap={isSidebar ? "md" : "xs"}
            wrap="nowrap"
          >
            <Avatar
              src={avatarUrl}
              color="blue"
              radius="xl"
              size={isSidebar ? "md" : "md"}
            >
              {role?.slice(0, 1)}
            </Avatar>

            <Box
              visibleFrom="sm"
              style={{
                root: {
                  marginRight: isSidebar ? 0 : theme.spacing.sm,
                  width: isSidebar ? "100%" : "auto",
                },
              }}
            >
              <Text
                styles={{
                  root: { fontWeight: 500, lineHeight: 1, textAlign: "start" },
                }}
                size={isSidebar ? "sm" : "sm"}
              >
                {isSidebar ? `Welcome, ${role}` : role}
              </Text>
              <Text
                c="dimmed"
                size={isSidebar ? "md" : "sm"}
                styles={{
                  root: {
                    fontSize: theme.fontSizes.xs,
                    marginTop: isSidebar ? 2 : 0,
                    // color:
                    //   theme.colorScheme === "dark"
                    //     ? theme.colors.dark[2]
                    //     : theme.colors.gray[6],
                  },
                }}
                lineClamp={1}
              >
                {userEmail}
              </Text>
            </Box>

            <IconChevronDown
              size={isSidebar ? 20 : 16}
              stroke={1.5}
              style={{
                marginLeft: isSidebar ? "auto" : 0,
                transition: "transform 200ms ease",
                transform: menuOpened ? "rotate(180deg)" : "none",
              }}
            />
          </Group>
        </Paper>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>

        <Menu.Item
          leftSection={<IconUser size={16} color={theme.primaryColor[6]} />}
        >
          Profile
        </Menu.Item>

        <Menu.Item
          leftSection={<IconSettings size={16} color={theme.primaryColor[6]} />}
        >
          Settings
        </Menu.Item>

        {menuItems.length > 0 && (
          <>
            <Menu.Divider />
            <Menu.Label>Options</Menu.Label>
            {menuItems.map((item, i) => (
              <Menu.Item key={i} leftSection={item.icon} onClick={item.onClick}>
                {item.label}
              </Menu.Item>
            ))}
          </>
        )}

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={handleLogout}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
