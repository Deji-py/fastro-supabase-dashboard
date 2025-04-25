"use client";
import { FASTRO_APP_LAYOUT, sidebarPosType } from "@/types";
import {
  AppShell,
  Burger,
  Flex,
  Group,
  useMantineTheme,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { ReactNode } from "react";

function FastroApp({
  layout,
  children,
  collapsable,
}: {
  layout: FASTRO_APP_LAYOUT;
  children: ReactNode;
  collapsable?: boolean;
}) {
  const { header, sidebar } = layout;

  const theme = useMantineTheme();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure(false);
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(
    collapsable ? false : true
  );

  const footerHeight = 60;
  const navbarWidth = 300;

  return (
    <AppShell
      layout="alt"
      navbar={{
        width: navbarWidth,
        breakpoint: "sm",
        collapsed: {
          mobile: !mobileOpened,
          desktop: collapsable ? !desktopOpened : false,
        },
      }}
      footer={{ height: footerHeight }}
      header={{ height: 60 }}
    >
      {/* Header with burger + user-provided children */}
      {header && (
        <header.section>
          <Flex w="100%" align="center" justify="space-between" px="md">
            <Group h="100%">
              {/* Mobile burger */}
              <Burger
                opened={mobileOpened}
                onClick={toggleMobile}
                hiddenFrom="sm"
                size="sm"
              />

              {/* Optional desktop burger */}
              {collapsable && (
                <Burger
                  opened={desktopOpened}
                  onClick={toggleDesktop}
                  visibleFrom="sm"
                  size="sm"
                />
              )}
            </Group>
            {header.children}
          </Flex>
        </header.section>
      )}

      {/* Sidebar with close burger */}
      {sidebar?.map((item, index) => (
        <item.section key={index} position={item.position as sidebarPosType}>
          {/* Top-right burger only for mobile */}
          <Box
            pos="absolute"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "0.5rem 1rem",

              top: 15,
              width: "100vw",
              backgroundColor: "transparent",
            }}
            hiddenFrom="sm"
          >
            <Burger opened={mobileOpened} onClick={toggleMobile} size="sm" />
          </Box>
          {item.children}
        </item.section>
      ))}

      {/* Main content */}
      <AppShell.Main bg={theme.colors.gray[1]}>{children}</AppShell.Main>
    </AppShell>
  );
}

export default FastroApp;
