import { sidebarPosType } from "@/types";
import { AppShell } from "@mantine/core";
import React, { ReactNode } from "react";

function FastroAppSidebar({
  children,
  position,
}: {
  children: ReactNode;
  position: sidebarPosType;
}) {
  switch (position) {
    case "left":
      return <AppShell.Navbar>{children}</AppShell.Navbar>;
    case "right":
      return <AppShell.Aside w={300}>{children}</AppShell.Aside>;
    default:
      break;
  }
}

export default FastroAppSidebar;
