import React from "react";
import { Box, Group, Text, Select, Paper, Title } from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { APP_NAME_SHORT } from "@/app_meta/constants";

interface FastroDashboardHeaderProps {
  variant?: "default" | "compact" | "minimal";
  username?: string;
  role?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
}

const filterOptions = [
  { value: "all", label: "All Time" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
];

const Fastro_Dashboard_Header: React.FC<FastroDashboardHeaderProps> = ({
  variant = "default",
  role = "Admin",
  filterValue = "all",
  onFilterChange,
}) => {
  const isCompact = variant === "compact";
  const isMinimal = variant === "minimal";

  return (
    <Group justify="space-between" align="center">
      <Box>
        {!isMinimal && (
          <>
            <Title ff="heading" order={isCompact ? 3 : 2}>
              Dashboard
            </Title>
            <Text size={isCompact ? "sm" : "md"} c="dimmed">
              Hi {role}, Welcome back to {APP_NAME_SHORT} Admin!
            </Text>
          </>
        )}
        {isMinimal && <Title order={3}>Welcome, {role}</Title>}
      </Box>

      {!isMinimal && (
        <Paper withBorder radius="md">
          <Select
            value={filterValue}
            onChange={(value) => value && onFilterChange?.(value)}
            data={filterOptions}
            leftSection={<IconCalendarEvent size={16} color="#4c6ef5" />}
            placeholder="Filter Period"
            variant="unstyled"
            styles={{ input: { fontWeight: 500, paddingLeft: 28 } }}
          />
        </Paper>
      )}
    </Group>
  );
};

export default Fastro_Dashboard_Header;
