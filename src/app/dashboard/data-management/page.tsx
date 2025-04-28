"use client";
import React from "react";
import { Container, Flex, Paper, Tabs } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import {
  IconCategory,
  IconCube3dSphere,
  IconLocation,
} from "@tabler/icons-react";
import CategoriesTable from "@/features/data-management/Categories";
import CountriesTable from "@/features/data-management/CountryTable";
import IndustriesTable from "@/features/data-management/IndustriesTable";

const DataManagement = () => {
  return (
    <Container style={{ overflow: "hidden" }} py={"md"} h={"90vh"} fluid>
      <Paper radius="md" h={"100%"} withBorder>
        <Tabs
          defaultValue={"categories"}
          orientation="vertical"
          style={{ height: "100%" }}
        >
          <Flex style={{ height: "100%", width: "100%" }}>
            <Paper
              bg={"gray.0"}
              radius="md"
              style={{
                width: 250,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "0",
              }}
            >
              <Tabs.List style={{ height: "100%" }}>
                <Tabs.Tab
                  my={"md"}
                  px={"lg"}
                  value="categories"
                  leftSection={<IconCategory size={20} />}
                >
                  Category Management
                </Tabs.Tab>
                <Tabs.Tab
                  my={"md"}
                  px={"lg"}
                  value="locations"
                  leftSection={<IconLocation size={20} />}
                >
                  Location Management
                </Tabs.Tab>
                <Tabs.Tab
                  my={"md"}
                  px={"lg"}
                  value="industries"
                  leftSection={<IconCube3dSphere size={20} />}
                >
                  Industry Management
                </Tabs.Tab>
              </Tabs.List>
            </Paper>

            {/* Right Content Area */}
            <ModalsProvider>
              <Tabs.Panel
                p={10}
                value="categories"
                style={{
                  flex: 1,
                  maxWidth: "100%", // Ensure it does not overflow
                  overflowX: "auto", // Enable horizontal scrolling if the table is too wide
                }}
              >
                <CategoriesTable />
              </Tabs.Panel>

              <Tabs.Panel
                p={10}
                value="locations"
                style={{
                  flex: 1,
                  maxWidth: "100%", // Ensure it does not overflow
                  overflowX: "auto", // Enable horizontal scrolling if the table is too wide
                }}
              >
                <CountriesTable />
              </Tabs.Panel>

              <Tabs.Panel
                p={10}
                value="industries"
                style={{
                  flex: 1,
                  maxWidth: "100%", // Ensure it does not overflow
                  overflowX: "auto", // Enable horizontal scrolling if the table is too wide
                }}
              >
                <IndustriesTable />
              </Tabs.Panel>
            </ModalsProvider>
          </Flex>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default DataManagement;
