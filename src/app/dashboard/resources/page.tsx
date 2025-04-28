"use client";

import { Box, Container, Paper, Tabs } from "@mantine/core";
import { IconFile, IconBook, IconRoad } from "@tabler/icons-react";
import { useState } from "react";
import { ModalsProvider } from "@mantine/modals";

import ResourcesTable from "@/features/resources/files_and_ebooks";
import CaseStudies from "@/features/resources/caseStudies";
import FeaturesRoadmapTable from "@/features/resources/FeaturesRoadmap";

function Databases_page() {
  const [openedTabs, setOpenedTabs] = useState<Set<string>>(
    new Set(["resources"])
  );

  const handleTabChange = (value: string | null) => {
    if (value) {
      setOpenedTabs((prev) => new Set(prev).add(value));
    }
  };

  return (
    <Box mb="md">
      <Tabs
        defaultValue="resources"
        variant="default"
        radius="md"
        onChange={handleTabChange}
      >
        <Container fluid pt="md" mb={20}>
          <Paper radius="md" pt="md" withBorder>
            <Tabs.List>
              <Tabs.Tab value="resources" leftSection={<IconFile size={16} />}>
                Resources
              </Tabs.Tab>
              <Tabs.Tab
                value="case-studies"
                leftSection={<IconBook size={16} />}
              >
                Case Studies
              </Tabs.Tab>
              <Tabs.Tab
                value="features-roadmap"
                leftSection={<IconRoad size={16} />}
              >
                Feature Roadmap
              </Tabs.Tab>
            </Tabs.List>
          </Paper>
        </Container>

        <ModalsProvider>
          {openedTabs.has("resources") && (
            <Tabs.Panel value="resources">
              <ResourcesTable />
            </Tabs.Panel>
          )}
          {openedTabs.has("case-studies") && (
            <Tabs.Panel value="case-studies">
              <CaseStudies />
            </Tabs.Panel>
          )}
          {openedTabs.has("features-roadmap") && (
            <Tabs.Panel value="features-roadmap">
              <FeaturesRoadmapTable />
            </Tabs.Panel>
          )}
        </ModalsProvider>
      </Tabs>
    </Box>
  );
}

export default Databases_page;
