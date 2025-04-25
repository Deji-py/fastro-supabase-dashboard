import { AppShell, Group } from "@mantine/core";
import React, { ReactNode } from "react";

function FastroAppHeader({ children }: { children: ReactNode }) {
  return (
    <AppShell.Header>
      <Group h="100%" w={"100%"} p="sm">
        {children}
      </Group>
    </AppShell.Header>
  );
}

export default FastroAppHeader;
