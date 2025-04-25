// components/Fastro_Stat_Grid.tsx
"use client";

import React from "react";
import {
  Title,
  Text,
  Grid,
  Stack,
  Card,
  useMantineTheme,
  Group,
  MantineRadius,
} from "@mantine/core";
import { BarChart, LineChart } from "@mantine/charts";

// Define the structure of each stat item
export type FastroStatItemType = {
  title: string;
  type: "chart" | "count";
  chart_data?: {
    type: "bar" | "line";
    data: any[];
  } | null;
  total?: number;
  icon?: React.ReactNode;
  subtext?: string | null;
};

// Supported style variants
export type StatCardVariant =
  | "simple"
  | "icon-top"
  | "icon-left"
  | "outlined"
  | "glass";

// Mantine-compatible card with styling variants and data rendering
const StatCard = ({
  item,
  variant = "simple",
  radius,
}: {
  item: FastroStatItemType;
  variant?: StatCardVariant;
  radius: MantineRadius;
}) => {
  const theme = useMantineTheme();
  // Render chart if type is 'chart'
  const renderChart = () => {
    if (!item.chart_data) return null;
    if (item.chart_data.type === "bar") {
      return (
        <BarChart h={120} data={item.chart_data.data} series={[]} dataKey="" />
      );
    }
    if (item.chart_data.type === "line") {
      return (
        <LineChart h={120} data={item.chart_data.data} series={[]} dataKey="" />
      );
    }
    return null;
  };

  // Variant-based styling using Mantine props
  const getCardStyles = (): React.CSSProperties => {
    switch (variant) {
      case "outlined":
        return {
          border: `1px solid ${theme.colors[theme.primaryColor][6]}`,
          backgroundColor: "white",
          color: theme.colors[theme.primaryColor][6],
        };
      case "glass":
        return {
          backgroundColor: "rgba(59, 130, 246, 0.3)",
          backdropFilter: "blur(8px)",
          color: "white",
        };
      case "icon-left":
        return {
          backgroundColor: theme.colors[theme.primaryColor][6],
          color: "white",
        };
      case "icon-top":
        return {
          backgroundColor: theme.colors[theme.primaryColor][6],
          color: "white",
        };
      default:
        return {
          backgroundColor: theme.colors[theme.primaryColor][6],
          color: "white",
        };
    }
  };

  return (
    <Card padding="lg" radius={radius} withBorder style={getCardStyles()}>
      <Stack gap="xs">
        {/* Layout for icon-left uses horizontal flex */}
        <div
          style={{
            display: variant === "icon-left" ? "flex" : "block",
            gap: 12,
            alignItems: "center",
          }}
        >
          {/* Render icon when applicable */}
          {item.icon && variant !== "simple" && variant !== "outlined" && (
            <>
              <div style={{ marginBottom: variant === "icon-top" ? 8 : 0 }}>
                {item.icon}
              </div>

              <div
                style={{
                  marginBottom: variant === "icon-top" ? 8 : 0,
                  position: "absolute",
                  scale: "6",
                  right: "10%",
                  top: "25%",
                  color: theme.colors[theme.primaryColor][5],
                }}
              >
                {item.icon}
              </div>
            </>
          )}

          <div>
            {/* Title */}
            <Text size="sm" opacity={0.8}>
              {item.title}
            </Text>
            <Group>
              {/* Count value for type 'count' */}
              {item.type === "count" && (
                <Title
                  order={3}
                  style={{ fontSize: "1.875rem", fontWeight: 700 }}
                >
                  {item.total?.toLocaleString()}
                </Title>
              )}

              {/* Optional subtext */}
              {item.subtext && (
                <Text size="xs" opacity={0.6}>
                  {item.subtext}
                </Text>
              )}
            </Group>
          </div>
        </div>

        {/* Chart rendering for type 'chart' */}
        {item.type === "chart" && renderChart()}
      </Stack>
    </Card>
  );
};

// Grid container that renders up to 4 stat cards
function Fastro_Stat_Grid({
  data,
  variant = "simple",
  radius = "md",
}: {
  data: FastroStatItemType[];
  variant?: StatCardVariant;
  radius?: MantineRadius;
}) {
  return (
    <Grid>
      {data.slice(0, 4).map((item, idx) => (
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={idx}>
          <StatCard radius={radius} item={item} variant={variant} />
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default Fastro_Stat_Grid;
