import React, { useState } from "react";
import { MultiSelect, Text } from "@mantine/core";
import { useFastroData } from "@/lib/Fastro";

type User = {
  user_id: string;
  email: string;
};

interface EmailListSelectProps {
  label: string;
  placeholder?: string;
  onChange: (value: string[]) => void; // Callback when selection changes
  disabled?: boolean;
}

const EmailListSelect: React.FC<EmailListSelectProps> = ({
  label,
  placeholder = "Search for users...",
  onChange,
  disabled = false,
}) => {
  const { useQuery } = useFastroData();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Track selected values
  const { data: users = [], isLoading, error } = useQuery<User[]>("users");

  if (isLoading) return <Text>Loading...</Text>;

  if (error) return <Text c="red">{(error as Error).message}</Text>;

  const options = users?.map((user) => ({
    label: user.email,
    value: user.user_id,
  }));

  const handleSelectChange = (value: string[]) => {
    setSelectedUsers(value); // Update the selected users
    onChange(value); // Pass the selected user IDs to the parent component
  };

  return (
    <div>
      <Text size="sm" mb={5}>
        {label}
      </Text>
      <MultiSelect
        data={options}
        value={selectedUsers} // Bind selected values here
        onChange={handleSelectChange}
        placeholder={placeholder}
        disabled={disabled}
        searchable
        clearable
        maxValues={5} // Limit to 5 selected users
        nothingFoundMessage="No users found"
        label="Select Users"
      />
    </div>
  );
};

export default EmailListSelect;
