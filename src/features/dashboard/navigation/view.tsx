import { NavItem } from "@/components/molecules/blocks/Fastro_NavigationList";
import { Stack, Text, useMantineTheme } from "@mantine/core";
import { IconDatabaseEdit, IconInfoCircle } from "@tabler/icons-react";
import React from "react";
import Fastro_NavigationList from "@/components/molecules/blocks/Fastro_NavigationList";
import Fastro_AppBrand from "@/components/molecules/blocks/Fastro_AppBrand";
import {
  Bell,
  Boxes,
  CreditCard,
  DatabaseZap,
  DollarSign,
  HomeIcon,
  MailOpen,
  PenBox,
  User,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useNotifications } from "@/providers/notification-provider";

function AppNavigation() {
  const theme = useMantineTheme();
  const pathname = usePathname();
  const { notifications } = useNotifications();

  const items: NavItem[] = [
    {
      label: "Dashboard",
      icon: (active) => (
        <HomeIcon
          style={{ width: 22, height: 22 }}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/",
      active: pathname.endsWith("dashboard"),
    },
    {
      label: "All Users",
      icon: (active) => (
        <Users
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/dashboard/users",
      active: pathname.includes("users"),
    },
    {
      label: "Databases",
      icon: (active) => (
        <DatabaseZap
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/dashboard/database",
      active: pathname.includes("database"),
    },
    {
      label: "Data Management",
      icon: (active) => (
        <IconDatabaseEdit
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/dashboard/data-management",
      active: pathname.includes("data-management"),
    },
    {
      label: "Earnings",
      icon: (active) => (
        <DollarSign
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/dashboard/earnings",
      active: pathname.includes("earnings"),
    },
    {
      label: "Blogs",
      icon: (active) => (
        <PenBox
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/dashboard/blogs",
      active: pathname.includes("blogs"),
    },
    {
      label: "Resources",
      icon: (active) => (
        <Boxes
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/dashboard/resources",
      active: pathname.includes("resources"),
    },
    {
      label: "Send Mail",
      icon: (active) => (
        <MailOpen
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/dashboard/send-mail",
      active: pathname.includes("send-mail"),
    },
    {
      label: "Activities",
      icon: (active) => (
        <Bell
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/dashboard/activities",
      active: pathname.includes("activities"),
      notification:
        notifications.totalUnseen > 0
          ? { count: notifications.totalUnseen }
          : undefined,
    },
    {
      label: "Payment Settings",
      icon: (active) => (
        <CreditCard
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/dashboard/payment-settings",
      active: pathname.includes("payment-settings"),
    },
    {
      label: "Profile Settings",
      icon: (active) => (
        <User
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/dashboard/profile-settings",
      active: pathname.includes("profile-settings"),
    },
    {
      label: "About",
      icon: (active) => (
        <IconInfoCircle
          size={22}
          color={
            !active
              ? theme.colors[theme.primaryColor][6]
              : theme.colors[theme.primaryColor][6]
          }
        />
      ),
      href: "/about",
    },
  ];

  return (
    <Stack gap={4}>
      <Fastro_AppBrand />
      <Fastro_NavigationList items={items} />
      <Text size="xs" c="dimmed" style={{ textAlign: "center" }}>
        v.1.0
      </Text>
    </Stack>
  );
}

export default AppNavigation;
