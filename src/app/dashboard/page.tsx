"use client";
import Fastro_Dashboard_Header from "@/components/molecules/blocks/Fastro_Dashboard_Header";
import Fastro_List_Render from "@/components/molecules/blocks/Fastro_List_Render";
import Fastro_Stat_Grid, {
  FastroStatItemType,
} from "@/components/molecules/blocks/Fastro_Stat_Grid";
import formatCurrency from "@/helpers/formatCurrency";
import { useFastroData } from "@/lib/Fastro";
import { useNotifications } from "@/providers/notification-provider";
import { PaymentHistory } from "@/types/data_types";
import { FastroListItemType } from "@/utils/FastroListItem";
import { Grid, Stack } from "@mantine/core";
import {
  IconBrandInstagram,
  IconCash,
  IconMicrophone,
  IconMoneybag,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";
import { Building2, CameraIcon, PenBox } from "lucide-react";
import moment from "moment";
import { useState, useEffect } from "react";

function Dashboard() {
  const { useQuery } = useFastroData();
  const [filterRange, setFilterRange] = useState<string>("all");
  const [localNotifications, setLocalNotifications] = useState<any[]>([]); // Store notifications in local state

  // Get notifications state from NotificationProvider
  const { notifications } = useNotifications();

  // Determine the start date based on filter range
  const startDate =
    filterRange === "all"
      ? null
      : moment().subtract(parseInt(filterRange), "days").toISOString();

  // Filters to apply
  const dateFilter = startDate ? { gte: { created_at: startDate } } : {}; // empty if "all"

  const { count: totalUsers = 0 } = useQuery("users", {
    count: "exact",
    filters: dateFilter,
  });
  const { count: paidUsers = 0 } = useQuery("users", {
    count: "exact",
    filters: { eq: { plan: "premium" }, ...dateFilter },
  });
  const { count: freeUsers = 0 } = useQuery("users", {
    count: "exact",
    filters: { eq: { plan: "free" }, ...dateFilter },
  });

  const { data: paymentData } = useQuery("payment_history", {
    select: "*,  users(firstname, lastname, profile_pic)",
    filters: {
      eq: { disbursement_status: true },
      ...(startDate ? { gte: { created_at: startDate } } : {}),
    },
  });

  const { count: influencerCount = 0 } = useQuery("influencers", {
    count: "exact",
  });
  const { count: podcastCount = 0 } = useQuery("podcasts", { count: "exact" });
  const { count: investorCount = 0 } = useQuery("investors", {
    count: "exact",
  });
  const { count: businessCount = 0 } = useQuery("business", { count: "exact" });
  const { count: bloggerCount = 0 } = useQuery("bloggers", {
    count: "exact",
  });
  const { count: journalistCount = 0 } = useQuery("journalists", {
    count: "exact",
  });

  const payments = (paymentData || []) as PaymentHistory[];

  const totalRevenue = (payments || []).reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  const stats: FastroStatItemType[] = [
    {
      title: "All Users",
      type: "count",
      total: (totalUsers as number) || 0,
      icon: <IconUsers size={32} />,
      subtext: null,
    },
    {
      title: "Paid Users",
      type: "count",
      total: (paidUsers as number) || 0,
      icon: <IconMoneybag size={32} />,
      subtext: null,
    },
    {
      title: "Free Trial Users",
      type: "count",
      total: (freeUsers as number) || 0,
      icon: <IconSearch size={32} />,
      subtext: null,
    },
    {
      title: "Revenue Generated",
      type: "count",
      total: formatCurrency(totalRevenue || 0),
      icon: <IconCash size={32} />,
      subtext: "$USD",
    },
  ];

  const databases: FastroListItemType[] = [
    {
      id: "1",
      title: "Podcasts",
      subtitle: "Podcast and Podcast Hosts",
      rightLabel: podcastCount?.toString() || "0",
      icon: <IconMicrophone size={"2rem"} />,
      color: "orange",
    },
    {
      id: "2",
      title: "Influencers",
      subtitle: "Social media influencers & creators",
      rightLabel: influencerCount?.toString() || "0",
      icon: <IconBrandInstagram size={"2rem"} />,
      color: "red",
    },
    {
      id: "3",
      title: "Investors",
      subtitle: "Investors in our platform",
      rightLabel: investorCount?.toString() || "0",
      icon: <IconMoneybag size={"2rem"} />,
    },
    {
      id: "4",
      title: "Businesses",
      subtitle: "Business profiles in the platform",
      rightLabel: businessCount?.toString() || "0",
      icon: <Building2 size={"2rem"} />,
      color: "indigo",
    },
    {
      id: "5",
      title: "Bloggers",
      subtitle: "Bloggers contributing to our content",
      rightLabel: bloggerCount?.toString() || "0",
      icon: <PenBox size={"2rem"} />,
      color: "pink",
    },
    {
      id: "6",
      title: "Journalists",
      subtitle: "Journalists and media professionals",
      rightLabel: journalistCount?.toString() || "0",
      icon: <CameraIcon size={"2rem"} />,
      color: "teal",
    },
  ];

  // Sync localNotifications state with notifications from context
  useEffect(() => {
    if (notifications?.groups?.length > 0) {
      const newNotifications = notifications.groups.flatMap(
        (group) => group.activities
      );
      setLocalNotifications(newNotifications); // Update local state with notification data
    }
  }, [notifications]);

  return (
    <Stack
      w="100%"
      pt={{ base: "20px", sm: "30px", md: "40px", lg: "50px" }}
      px={{ base: "16px", sm: "20px", md: "32px", lg: "40px", xl: "60px" }}
    >
      <Fastro_Dashboard_Header
        filterValue={filterRange}
        onFilterChange={setFilterRange}
        variant="compact"
      />
      <Fastro_Stat_Grid radius="lg" data={stats} variant="icon-top" />
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 6, xl: 4 }}>
          <Fastro_List_Render
            radius="lg"
            data={databases}
            variant="with-icon-and-label"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 6, xl: 4 }}>
          <Fastro_List_Render
            radius="lg"
            header="Recent Activities"
            data={localNotifications.map((notification) => ({
              id: notification.id.toString(),
              title: notification.activity_name,
              rightLabel: moment(notification.timestamp).fromNow(),
              subtitle: notification.details,
            }))}
            variant="notification"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 12, lg: 12, xl: 4 }}>
          <Stack>
            <Fastro_List_Render
              header="Recent Sales"
              data={payments.map((item) => ({
                id: item.id.toString(),
                title: `${item.users.firstname} ${item.users.lastname}`,
                rightLabel: formatCurrency(item.amount as number),
                subtitle: moment(item.created_at).format("ll"),
                profile_pic: item.users.profile_pic,
              }))}
              variant="avatar-left-with-label"
            />
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export default Dashboard;
