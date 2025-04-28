"use client";

import { Box, Center, Container, Paper, Tabs } from "@mantine/core";
import { IconBrandInstagram, IconMoneybag } from "@tabler/icons-react";
import { Building2, CameraIcon, Mic, PenBox } from "lucide-react";
import InfluencersTable from "@/features/databases/influencers";
import PodcastsTable from "@/features/databases/podcasts";
import BusinessesTable from "@/features/databases/businesses";
import InvestorsTable from "@/features/databases/investors";
import BloggersTable from "@/features/databases/bloggers";
import JournalistsTable from "@/features/databases/journalists";
import { useState } from "react";
import { ModalsProvider } from "@mantine/modals";

function Databases_page() {
  const [openedTabs, setOpenedTabs] = useState<Set<string>>(
    new Set(["influencer"])
  );

  const handleTabChange = (value: string | null) => {
    setOpenedTabs((prev) => new Set(prev).add(value as string));
  };

  return (
    <Box mb="md">
      <Tabs
        defaultValue="influencer"
        variant="default"
        radius="md"
        onChange={handleTabChange}
      >
        <Container fluid pt="md" mb={10}>
          <Paper radius="md" pt="md" withBorder>
            <Tabs.List>
              <Tabs.Tab
                value="influencer"
                leftSection={<IconBrandInstagram size={16} />}
              >
                Influencers
              </Tabs.Tab>
              <Tabs.Tab
                value="businesses"
                leftSection={<Building2 size={16} />}
              >
                Businesses
              </Tabs.Tab>
              <Tabs.Tab
                value="investors"
                leftSection={<IconMoneybag size={16} />}
              >
                Investors
              </Tabs.Tab>
              <Tabs.Tab value="bloggers" leftSection={<PenBox size={16} />}>
                Bloggers
              </Tabs.Tab>
              <Tabs.Tab
                value="journalists"
                leftSection={<CameraIcon size={16} />}
              >
                Journalists
              </Tabs.Tab>
              <Tabs.Tab value="podcasts" leftSection={<Mic size={16} />}>
                Podcasts
              </Tabs.Tab>
            </Tabs.List>
          </Paper>
        </Container>

        <ModalsProvider>
          {openedTabs.has("influencer") && (
            <Tabs.Panel value="influencer">
              <InfluencersTable />
            </Tabs.Panel>
          )}

          {openedTabs.has("businesses") && (
            <Tabs.Panel value="businesses">
              <BusinessesTable />
            </Tabs.Panel>
          )}

          {openedTabs.has("investors") && (
            <Tabs.Panel value="investors">
              <InvestorsTable />
            </Tabs.Panel>
          )}

          {openedTabs.has("bloggers") && (
            <Tabs.Panel value="bloggers">
              <BloggersTable />
            </Tabs.Panel>
          )}

          {openedTabs.has("journalists") && (
            <Tabs.Panel value="journalists">
              <JournalistsTable />
            </Tabs.Panel>
          )}

          {openedTabs.has("podcasts") && (
            <Tabs.Panel value="podcasts">
              <PodcastsTable />
            </Tabs.Panel>
          )}
        </ModalsProvider>
      </Tabs>
    </Box>
  );
}

export default Databases_page;
