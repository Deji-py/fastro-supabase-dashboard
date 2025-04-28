"use client";
import React from "react";
import {
  Button,
  Card,
  Divider,
  Flex,
  MantineRadius,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import FastroListItem, {
  FastroListItemType,
  FastroListVariant,
} from "@/utils/FastroListItem";

type Props = {
  data: FastroListItemType[];
  variant?: FastroListVariant;
  header?: string; // Optional header
  showHeader?: boolean; // Flag to conditionally show header
  radius?: MantineRadius | undefined;
  max?: number;
};

function Fastro_List_Render({
  data,
  variant = "minimal",
  header = "All Databases",
  showHeader = true,
  radius = "md",
  max = 7,
}: Props) {
  const theme = useMantineTheme();

  return (
    <Card p="md" radius={radius} withBorder>
      {showHeader && (
        <Flex justify="space-between" align="center" mb="md">
          <Text fw={600} size="lg">
            {header}
          </Text>
          <Button variant="subtle" size="xs" color={theme.primaryColor}>
            See all
          </Button>
        </Flex>
      )}
      <Divider mb={"md"} />
      <Stack gap="sm">
        {data.slice(0, max).map((item) => (
          <FastroListItem key={item.id} item={item} variant={variant} />
        ))}
      </Stack>
    </Card>
  );
}

export default Fastro_List_Render;
