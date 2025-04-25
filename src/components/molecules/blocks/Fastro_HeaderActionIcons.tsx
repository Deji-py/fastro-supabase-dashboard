"use client";

import type { ReactNode } from "react";
import { ActionIcon, Group, Tooltip } from "@mantine/core";

// Define the type for a single action icon
export interface ActionIconItem {
  icon: ReactNode;
  label?: string;
  onClick?: () => void;
  color?: string;
  variant?:
    | "subtle"
    | "filled"
    | "light"
    | "outline"
    | "transparent"
    | "default";
  disabled?: boolean;
  className?: string;
}

interface Fastro_HeaderActionIconsProps {
  icons: ActionIconItem[];
  spacing?: number | string;
  size?: number | string;
  className?: string;
  radius?: string;
}

function Fastro_HeaderActionIcons({
  icons,
  spacing = "xs",
  size = "md",
  className,
  radius = "md",
}: Fastro_HeaderActionIconsProps) {
  return (
    <Group visibleFrom="sm" gap={spacing} className={className}>
      {icons.map((item, index) => (
        <Tooltip
          key={index}
          label={item.label}
          disabled={!item.label}
          position="bottom"
          withArrow
        >
          <ActionIcon
            variant={item.variant || "default"}
            onClick={item.onClick}
            color={item.color}
            disabled={item.disabled}
            size={size}
            radius={radius}
            className={item.className}
            aria-label={item.label || `Action ${index + 1}`}
          >
            {item.icon}
          </ActionIcon>
        </Tooltip>
      ))}
    </Group>
  );
}

export default Fastro_HeaderActionIcons;
