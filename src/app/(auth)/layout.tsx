"use client";

import type React from "react";
import { Box, Center } from "@mantine/core";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Center style={{ minHeight: "100vh", background: "#f5f5f7" }}>
      {children}
    </Center>
  );
}
