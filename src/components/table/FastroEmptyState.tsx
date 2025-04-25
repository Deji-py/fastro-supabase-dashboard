import { Button, Loader, Text, Container } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

type EmptyStateProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  emptyMessage?: string; // New prop for custom empty message
  onCreateClick?: () => void;
};

const FastroEmptyState: React.FC<EmptyStateProps> = ({
  isLoading,
  isError,
  errorMessage = "Error loading data. Please try again.",
  emptyMessage = "No data found", // Default message if no data
  onCreateClick,
}) => {
  return (
    <Container size="xs" py="xl" style={{ textAlign: "center" }}>
      {isLoading ? (
        <div>
          <Loader size="lg" />
          <Text mt="md">Loading data...</Text>
        </div>
      ) : isError ? (
        <div>
          <Text c="red" size="lg" fw={500} mb="md">
            {errorMessage}
          </Text>
          <Button leftSection={<IconPlus size={16} />} onClick={onCreateClick}>
            Retry
          </Button>
        </div>
      ) : (
        <div>
          <Text size="lg" fw={500} mb="md">
            {emptyMessage} {/* Use the custom empty message */}
          </Text>
          {onCreateClick && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={onCreateClick}
            >
              Add First User
            </Button>
          )}
        </div>
      )}
    </Container>
  );
};

export default FastroEmptyState;
