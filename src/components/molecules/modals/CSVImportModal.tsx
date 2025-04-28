import React, { useState } from "react";
import {
  Modal,
  Text,
  Button,
  Group,
  FileInput,
  Switch,
  Stack,
} from "@mantine/core";
import { CSVImportModalProps } from "@/types";

function CSVImportModal({
  opened,
  onClose,
  onImportSuccess,
  onCSVImport,
}: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [useBatchProcessing, setUseBatchProcessing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file || !onCSVImport) return;

    setIsLoading(true);

    try {
      await onCSVImport(file, useBatchProcessing);
      onImportSuccess({ success: true });
      onClose();
    } catch (error) {
      console.error("CSV import failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Import CSV" size="md">
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Select a CSV file to import data into the table.
        </Text>

        <FileInput
          accept=".csv"
          placeholder="Choose CSV file"
          value={file}
          onChange={setFile}
          clearable
        />

        <Switch
          label="Use batch processing for large files"
          checked={useBatchProcessing}
          onChange={(e) => setUseBatchProcessing(e.currentTarget.checked)}
        />

        <Text size="xs" c="dimmed">
          Batch processing is recommended for files with more than 1000 rows.
          Progress can be monitored in the Job Dashboard.
        </Text>

        <Group align="right" mt="md">
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isLoading} disabled={!file}>
            Import
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export const MmemoizedCSVImport = React.memo(CSVImportModal);
