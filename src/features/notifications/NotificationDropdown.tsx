import { Activity, useNotifications } from "@/providers/notification-provider";
import {
  Text,
  ScrollArea,
  Stack,
  Group,
  Badge,
  Button,
  Divider,
} from "@mantine/core";
import moment from "moment";
import { useEffect, useState } from "react";

interface NotificationListProps {
  activities: Activity[];
  pageSize?: number;
}

export default function NotificationList({
  activities,
  pageSize = 5,
}: NotificationListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { markAllAsRead } = useNotifications();

  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  const totalPages = Math.ceil(activities.length / pageSize);

  const paginatedActivities = activities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [activities.length, totalPages]);

  return (
    <Stack gap="sm">
      <Text fw={600} mb="xs">
        Notifications
      </Text>

      <ScrollArea h={250}>
        <Stack gap="md">
          {paginatedActivities.length === 0 ? (
            <Text size="sm" c="dimmed">
              No new activities!
            </Text>
          ) : (
            paginatedActivities.map((activity) => (
              <Group key={activity.id} align="flex-start">
                <div>
                  <Text lineClamp={1} size="sm" fw={500}>
                    {activity.activity_name}
                  </Text>
                  <Text lineClamp={1} size="xs" c="dimmed">
                    {activity.details}
                  </Text>
                  <Text size="xs" c="dimmed" mt={2}>
                    {moment(activity.timestamp).toNow()}
                  </Text>
                </div>

                {!activity.seen && (
                  <Badge size="xs" color="violet" variant="filled">
                    New
                  </Badge>
                )}
              </Group>
            ))
          )}
        </Stack>
      </ScrollArea>

      {totalPages > 1 && (
        <>
          <Divider />
          <Group align="center" mt="sm">
            <Button
              variant="subtle"
              size="xs"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text size="xs" c="dimmed">
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              variant="subtle"
              size="xs"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </Group>
        </>
      )}
    </Stack>
  );
}
