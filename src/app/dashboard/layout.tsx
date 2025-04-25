"use client";
import { ReactNode } from "react";
import FastroAppSidebar from "@/components/molecules/layout/FastroAppSidebar";
import { FASTRO_APP_LAYOUT } from "@/types";
import React from "react";
import FastroApp from "@/components/molecules/layout/FastroApp";
import FastroAppHeader from "@/components/molecules/layout/FastroAppHeader";
import AppNavigation from "@/features/dashboard/navigation/view";
import HeaderView from "@/features/dashboard/header/view";

const app_layout: FASTRO_APP_LAYOUT = {
  header: {
    section: FastroAppHeader, // Pass the component directly
    children: <HeaderView />, // Single header content
  },
  sidebar: [
    {
      section: FastroAppSidebar,
      children: <AppNavigation />,
      position: "left",
    },
  ],
};

export default function FastroAppLayout({ children }: { children: ReactNode }) {
  return <FastroApp layout={app_layout}>{children}</FastroApp>;
}
