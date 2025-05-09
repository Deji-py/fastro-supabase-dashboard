import React from "react";
import { Box, NavLink, Text } from "@mantine/core";

export type NavItem = {
  label: string;
  icon?: (active: boolean) => React.ReactNode;
  onClick?: () => void;
  href?: string;
  active?: boolean;
};

type Fastro_NavigationListProps = {
  items: NavItem[];
  orientation?: "vertical" | "horizontal";
};

function Fastro_NavigationList({
  items,
  orientation = "vertical",
}: Fastro_NavigationListProps) {
  return (
    <Box
      p="sm"
      style={{
        display: orientation === "horizontal" ? "flex" : "block",
        gap: 12,
        flex: 1,
      }}
    >
      {items.map((item, index) => (
        <NavLink
          key={index}
          label={
            <Text size="sm" fw={500}>
              {item.label}
            </Text>
          }
          leftSection={
            typeof item.icon === "function"
              ? item.icon(!!item.active)
              : item.icon
          }
          component={item.href ? "a" : "button"}
          href={item.href}
          onClick={item.onClick}
          active={item.active}
          variant="light"
          style={{
            marginRight: orientation === "horizontal" ? 12 : 0,
            marginBottom: orientation === "vertical" ? 8 : 0,
            borderRadius: 5,
          }}
        />
      ))}
    </Box>
  );
}

export default Fastro_NavigationList;
