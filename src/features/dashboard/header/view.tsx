"use client";

import React, { useEffect, useState } from "react";
import { Flex, Group, Avatar, Skeleton, Text } from "@mantine/core";
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconFileText,
  IconHeart,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";

import { useMantineColorScheme } from "@mantine/core";
import Fastro_RichSearch from "@/components/molecules/blocks/Fastro_RichSearch";
import Fastro_HeaderActionIcons, {
  ActionIconItem,
} from "@/components/molecules/blocks/Fastro_HeaderActionIcons";
import FastroSearchItem from "@/utils/FastroSearchItem";
import { User as FastroUser } from "@/types";
import Fastro_UserGreeting from "@/components/molecules/blocks/Fastro_UserGreeting";

function HeaderView() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  const actionIcons: ActionIconItem[] = [
    {
      icon: <IconBrandDiscord size={20} />,
      label: "Discord",
      color: "indigo",
      onClick: () => window.open("https://discord.com", "_blank"),
      variant: "default",
    },
    {
      icon: <IconHeart size={20} />,
      label: "Like",
      color: "red",
      onClick: () => console.log("Liked!"),
      variant: "default",
    },
    {
      icon: <IconBrandGithub size={20} />,
      label: "GitHub",
      onClick: () => window.open("https://github.com", "_blank"),
      variant: "default",
    },
    {
      icon: <IconFileText size={20} />,
      label: "Documentation",
      onClick: () => console.log("Open docs"),
      variant: "default",
    },
    {
      icon: isDark ? <IconSun size={20} /> : <IconMoon size={20} />,
      label: isDark ? "Light mode" : "Dark mode",
      onClick: () => toggleColorScheme(),
      variant: "default",
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
