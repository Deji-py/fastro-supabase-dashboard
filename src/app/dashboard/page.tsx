"use client";
import Fastro_Dashboard_Header from "@/components/molecules/blocks/Fastro_Dashboard_Header";
import Fastro_List_Render from "@/components/molecules/blocks/Fastro_List_Render";
import Fastro_Stat_Grid, {
  FastroStatItemType,
} from "@/components/molecules/blocks/Fastro_Stat_Grid";
import { FastroListItemType } from "@/utils/FastroListItem";
import { Grid, Stack } from "@mantine/core";
import {
  IconCash,
  IconMicrophone,
  IconMoneybag,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";

const stats: FastroStatItemType[] = [
  {
    title: "All Users",
    type: "count",
    total: 6740,
    icon: <IconUsers size={32} />,
    subtext: null,
  },
  {
    title: "Paid Users",
    type: "count",
    total: 1320,
    icon: <IconMoneybag size={32} />,
    subtext: null,
  },
  {
    title: "Free Trial Users",
    type: "count",
    total: 5420,
    icon: <IconSearch size={32} />,
    subtext: null,
  },
  {
    title: "Revenue Generated",
    type: "count",
    total: 20919,
    icon: <IconCash size={32} />,
    subtext: "$USD",
  },
];

const sampleListData: FastroListItemType[] = [
  {
    id: "1",
    title: "Podcast",
    subtitle: "Podcast and Podcast Hosts",
    rightLabel: "458,561",
    icon: <IconMicrophone size={"2rem"} />,
  },
  {
    id: "2",
    title: "Influencers",
    subtitle: "Social media influencers & creators",
    badge: "700K",
    profile_pic: "/user1.png",
    rightLabel: "458,561",
  },
];

const payment: FastroListItemType[] = [
  {
    id: "1",
    title: "Jeremiah Skrill",
    subtitle: "20 minutes ago",
    rightLabel: "+$458",
    icon: <IconMicrophone size={"2rem"} />,
  },
  {
    id: "2",
    title: "Samuela David",
    subtitle: "1 hour ago",
    badge: "700K",
    profile_pic: "/user1.png",
    rightLabel: "+$458",
  },
];
const notification: FastroListItemType[] = [
  {
    id: "1",
    title: "Podcast and Podcast Hosts",
    subtitle: "Podcast and Podcast Hosts",
    rightLabel: "458,561",
  },
  {
    id: "2",
    title: "Social media influencers & creators",
    subtitle: "Social media influencers & creators",
    badge: "700K",
    profile_pic: "/user1.png",
    rightLabel: "458,561",
  },
  {
    id: "3",
    title:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi ex aliquam atque, autem obcaecati vitae enim blanditiis impedit ullam optio quia deserunt assumenda dolorem est, aliquid ad reprehenderit, ipsum corporis?",
    subtitle: "Social media influencers & creators",
    badge: "700K",
    profile_pic: "/user1.png",
    rightLabel: "458,561",
  },
  {
    id: "4",
    title: "Social media influencers & creators",
    subtitle: "Social media influencers & creators",
    badge: "700K",
    profile_pic: "/user1.png",
    rightLabel: "458,561",
  },
];

function Dashboard() {
  return (
    <Stack
      w="100%"
      pt={{ base: "20px", sm: "30px", md: "40px", lg: "50px" }}
      px={{ base: "16px", sm: "20px", md: "32px", lg: "40px", xl: "60px" }}
    >
      <Fastro_Dashboard_Header variant="compact" />
      <Fastro_Stat_Grid radius="lg" data={stats} variant="icon-top" />
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 6, xl: 4 }}>
          <Fastro_List_Render
            radius="lg"
            data={sampleListData}
            variant="with-icon-and-label"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6, xl: 4 }}>
          <Fastro_List_Render
            radius="lg"
            header="Recent Activities"
            data={notification}
            variant="notification"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 12, xl: 4 }}>
          <Fastro_List_Render
            header="Recent Sales"
            data={payment}
            variant="avatar-left-with-label"
          />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default Dashboard;
