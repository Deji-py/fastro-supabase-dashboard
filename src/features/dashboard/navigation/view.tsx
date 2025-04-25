import { NavItem } from "@/components/molecules/blocks/Fastro_NavigationList";
import { Stack, Text, useMantineTheme } from "@mantine/core";
import { IconInfoCircle, IconSettings } from "@tabler/icons-react";
import React from "react";
import Fastro_NavigationList from "@/components/molecules/blocks/Fastro_NavigationList";
import Fastro_AppBrand from "@/components/molecules/blocks/Fastro_AppBrand";
import { CreditCard, HomeIcon, Users } from "lucide-react";
import { usePathname } from "next/navigation";

function AppNavigation() {
  const theme = useMantineTheme();
  const pathname = usePathname();

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
