import React, { useEffect, useState } from "react";
import {
  Paper,
  Text,
  Group,
  ThemeIcon,
  Stack,
  SegmentedControl,
  Card,
  Container,
  Divider,
  Pagination,
  Center,
  Badge,
} from "@mantine/core";
import {
  IconCheck,
  IconUserPlus,
  IconCreditCard,
  IconAlertCircle,
  IconFolder,
  IconEdit,
  IconUsers,
  IconMail,
  IconLock,
  IconKey,
} from "@tabler/icons-react";
import moment from "moment";
import { useFastroData } from "@/lib/Fastro";
import { useNotifications } from "@/providers/notification-provider";

interface Activity {
  id: number;
  activity_name: string;
  details: string;
  seen: boolean;
  timestamp: string;
  user: string;
  type: string;
}

const getIconForActivity = (activityName: string) => {
  const lowerCaseActivityName = activityName.toLowerCase();

  if (/user.*(created|account)/.test(lowerCaseActivityName)) {
    return <IconUserPlus size={18} />;
  } else if (/credits.*purchased/.test(lowerCaseActivityName)) {
    return <IconCreditCard size={18} />;
  } else if (/login.*unusual.*location|ip/.test(lowerCaseActivityName)) {
    return <IconAlertCircle size={18} />;
  } else if (/folder.*created/.test(lowerCaseActivityName)) {
    return <IconFolder size={18} />;
  } else if (/item.*(renamed|shared)/.test(lowerCaseActivityName)) {
    return <IconEdit size={18} />;
  } else if (/payment.*(failed|abandoned)/.test(lowerCaseActivityName)) {
    return <IconCreditCard size={18} />;
  } else if (/refund.*(initiated|chargeback)/.test(lowerCaseActivityName)) {
    return <IconCreditCard size={18} />;
  } else if (/user.*(not.*logged in|inactive)/.test(lowerCaseActivityName)) {
    return <IconUsers size={18} />;
  } else if (/email.*verified/.test(lowerCaseActivityName)) {
    return <IconMail size={18} />;
  } else if (/user.*(changed.*email|password)/.test(lowerCaseActivityName)) {
    return <IconLock size={18} />;
  } else if (/updated.*billing/.test(lowerCaseActivityName)) {
    return <IconKey size={18} />;
  } else if (/low.*credit.*alert/.test(lowerCaseActivityName)) {
    return <IconAlertCircle size={18} />;
  } else if (/unsuccessful.*login.*attempts/.test(lowerCaseActivityName)) {
    return <IconAlertCircle size={18} />;
  } else if (/reactivated.*(after.*inactivity)/.test(lowerCaseActivityName)) {
    return <IconUserPlus size={18} />;
  } else if (/support.*request/.test(lowerCaseActivityName)) {
    return <IconMail size={18} />;
  } else if (/system.*(downtime|error)/.test(lowerCaseActivityName)) {
    return <IconAlertCircle size={18} />;
  } else if (/admin.*(updated.*permissions)/.test(lowerCaseActivityName)) {
    return <IconLock size={18} />;
  } else if (/unusual.*activity.*manual.*review/.test(lowerCaseActivityName)) {
    return <IconAlertCircle size={18} />;
  }

  return <IconCheck size={18} />;
};

const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

const highlightEmails = (text: string) => {
  return text.replace(emailPattern, (email) => {
    return `<span style="font-weight: bold;">${email}</span>`;
  });
};

const ActivityTimeline = () => {
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [localNotifications, setLocalNotifications] = useState<Activity[]>([]);

  const { notifications, markAllAsRead } = useNotifications();

  useEffect(() => {
    if (notifications?.groups) {
      const allActivities = notifications.groups.flatMap(
        (group) => group.activities
      );
      setLocalNotifications(allActivities);
    }
  }, [notifications]);

  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const activitiesPerPage = 5;

  const groupActivitiesByDate = (activities: Activity[]) => {
    const groups: { [key: string]: Activity[] } = {};
    activities.forEach((activity) => {
      const date = moment(activity.timestamp).format("MMMM D, YYYY");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    return groups;
  };

  const filteredActivities = localNotifications.filter(
    (activity) => filter === "all" || activity.activity_name.includes(filter)
  );

  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);

  const currentActivities = filteredActivities.slice(
    (currentPage - 1) * activitiesPerPage,
    currentPage * activitiesPerPage
  );

  const groupedActivities = groupActivitiesByDate(currentActivities);

  return (
    <Container size="md" p="lg">
      <Paper radius="md" p="xl">
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Text size="xl" fw={600}>
              Activity Timeline
            </Text>
            <SegmentedControl
              value={filter}
              onChange={(value) => {
                setFilter(value);
                setCurrentPage(1);
              }}
              data={[
                { label: "All", value: "all" },
                { label: "Accounts", value: "account" },
                { label: "Purchases", value: "purchase" },
                { label: "Security", value: "security" },
              ]}
            />
          </Group>

          {Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <Stack key={date} gap="xs">
              <Text fw={500} c="dimmed" size="sm">
                {date}
              </Text>
              {dateActivities.map((activity) => (
                <Card key={activity.id} padding="md" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Group>
                      <ThemeIcon
                        color="violet"
                        variant="light"
                        size="xl"
                        radius="xl"
                      >
                        {getIconForActivity(activity.activity_name)}
                      </ThemeIcon>
                      <Stack gap={2}>
                        <Group align="center" gap="xs">
                          <Text fw={500} size="sm">
                            {activity.activity_name.replace("-", " ")}
                          </Text>
                          {!activity.seen && (
                            <Badge color="violet" variant="dot" size="sm">
                              New
                            </Badge>
                          )}
                        </Group>
                        <Text size="sm">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightEmails(activity.details),
                            }}
                          />
                        </Text>
                      </Stack>
                    </Group>
                    <Text
                      size="sm"
                      c={activity.seen ? "dimmed" : "violet"}
                      style={{ fontWeight: 500 }}
                    >
                      {moment(activity.timestamp).fromNow()}
                    </Text>
                  </Group>
                </Card>
              ))}
              {date !== Object.keys(groupedActivities).slice(-1)[0] && (
                <Divider />
              )}
            </Stack>
          ))}

          {totalPages > 1 && (
            <Center mt="xl">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                color="violet"
                radius="md"
              />
            </Center>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default ActivityTimeline;
