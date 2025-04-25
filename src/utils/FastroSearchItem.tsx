import { User } from "@/types";
import { Avatar, Badge, Box, Flex, Group, Text } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

// STEP 1: extende the types with your actual search type

const FastroSearchItem = (item: User, tableName: string) => {
  // Render users
  if (tableName === "users") {
    const user = item as User;
    return (
      <Flex gap="md" align="center">
        <Avatar color="indigo" radius="xl">
          {user.firstname?.charAt(0) || <IconUser size={18} />}
        </Avatar>
        <Box>
          <Text size="sm">
            {user.firstname} {user.lastname}
          </Text>
          <Text size="xs" c="dimmed">
            {user.companyName}
          </Text>
        </Box>
      </Flex>
    );
  }

  // Extend render Items here

  // Fallback for unknown item types
  return <Text>Unknown item type</Text>;
};

export default FastroSearchItem;
