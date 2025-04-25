"use client";

import { useState, useRef } from "react";
import {
  Modal,
  Button,
  Text,
  Group,
  Progress,
  Box,
  Alert,
  FileInput,
  Stack,
  Checkbox,
  Select,
} from "@mantine/core";
import {
  IconUpload,
  IconAlertCircle,
  IconFileSpreadsheet,
  IconCheck,
  IconExternalLink,
} from "@tabler/icons-react";
import { BATCH_PROCESSOR_URL } from "@/app_meta/constants";

// Maximum file size for standard processing (5MB)
const MAX_STANDARD_FILE_SIZE = 2 * 1024 * 1024;

type CSVImportModalProps = {
  opened: boolean;
  onClose: () => void;
  onImportSuccess?: (data: any) => void;
  title?: string;
  acceptedFileTypes?: string;
  maxFileSize?: number;
  batchProcessingEnabled?: boolean;
};

function CSVImportModal({
  opened,
  onClose,
  onImportSuccess,
  title = "Import CSV Data",
  acceptedFileTypes = ".csv",
  maxFileSize = MAX_STANDARD_FILE_SIZE,
  batchProcessingEnabled = true,
}: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isLargeFile, setIsLargeFile] = useState(false);
  const [useBatchProcessing, setUseBatchProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [delimiter, setDelimiter] = useState(",");
  const [skipHeader, setSkipHeader] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle file selection
  const handleFileChange = (selectedFile: File | null) => {
    setError(null);
    setSuccess(false);
    setJobId(null);
    setFile(selectedFile);

    if (selectedFile) {
      // Check if file is too large
      const isLarge = selectedFile.size > maxFileSize;
      setIsLargeFile(isLarge);
      setUseBatchProcessing(isLarge && batchProcessingEnabled);
    } else {
      setIsLargeFile(false);
      setUseBatchProcessing(false);
    }
  };

  // Simulate upload progress
  const simulateProgress = () => {
    setIsUploading(true);
    setUploadProgress(0);

    intervalRef.current = setInterval(() => {
      setUploadProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  // Handle import
  const handleImport = async () => {
    if (!file) {
      setError("Please select a file to import");
      return;
    }

    try {
      setError(null);
      simulateProgress();

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("useBatchProcessing", String(useBatchProcessing));
      formData.append("skipHeader", String(skipHeader));
      formData.append("delimiter", delimiter);
      formData.append("table", "investors");

      // Send to API
      const response = await fetch("http://localhost:5000/csv-data/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to import file");
      }

      const data = await response.json();

      // Cleanup
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsUploading(false);
      setSuccess(true);
      setUploadProgress(100);

      // Set job ID if available
      if (data.jobId) {
        setJobId(data.jobId);
      }

      // Call success callback
      if (onImportSuccess) {
        onImportSuccess(data);
      }

      // Close modal after success (with delay)
      if (!useBatchProcessing) {
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (err) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsUploading(false);
      setError(err instanceof Error ? err.message : "Failed to import file");
    }
  };

  // Handle close
  const handleClose = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!isUploading) {
      setFile(null);
      setIsLargeFile(false);
      setUseBatchProcessing(false);
      setUploadProgress(0);
      setError(null);
      setSuccess(false);
      setJobId(null);
      onClose();
    }
  };

  // Open Bull Board in new tab
  const openBullBoard = () => {
    window.open(BATCH_PROCESSOR_URL, "_blank");
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={title}
      size="md"
      centered
    >
      <Stack gap="md">
        {/* File Input */}
        <FileInput
          label="Select CSV File"
          placeholder="Click to select file"
          accept={acceptedFileTypes}
          leftSection={<IconFileSpreadsheet size={16} />}
          value={file}
          onChange={handleFileChange}
          disabled={isUploading}
          error={error}
        />

        {/* CSV Options */}
        <Group grow>
          <Select
            label="Delimiter"
            data={[
              { value: ",", label: "Comma (,)" },
              { value: ";", label: "Semicolon (;)" },
              { value: "\t", label: "Tab" },
              { value: "|", label: "Pipe (|)" },
            ]}
            value={delimiter}
            onChange={(value) => setDelimiter(value || ",")}
            disabled={isUploading}
          />
          <Checkbox
            label="Skip header row"
            checked={skipHeader}
            onChange={(e) => setSkipHeader(e.currentTarget.checked)}
            disabled={isUploading}
            mt={24}
          />
        </Group>

        {/* Large File Warning */}
        {isLargeFile && batchProcessingEnabled && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Large File Detected"
            color="yellow"
          >
            <Text size="sm">
              This file is large (
              {(file?.size || 0) / (1024 * 1024) > 1
                ? `${((file?.size || 0) / (1024 * 1024)).toFixed(2)} MB`
                : `${((file?.size || 0) / 1024).toFixed(2)} KB`}
              ). Processing may take some time.
            </Text>
            <Checkbox
              mt="xs"
              label="Process in background (recommended)"
              checked={useBatchProcessing}
              onChange={(e) => setUseBatchProcessing(e.currentTarget.checked)}
              disabled={isUploading}
            />
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert
            icon={<IconCheck size={16} />}
            title="Import Successful"
            color="green"
          >
            <Text size="sm">
              {useBatchProcessing
                ? "Your file is being processed in the background."
                : "Your data has been successfully imported."}
            </Text>

            {useBatchProcessing && jobId && (
              <Button
                variant="light"
                color="blue"
                leftSection={<IconExternalLink size={16} />}
                onClick={openBullBoard}
                mt="xs"
                size="xs"
              >
                View Job Status
              </Button>
            )}
          </Alert>
        )}

        {/* Progress Bar */}
        {isUploading && (
          <Box>
            <Text size="sm" mb={5}>
              {useBatchProcessing ? "Preparing batch job..." : "Uploading..."}
            </Text>
            <Progress value={uploadProgress} striped />
          </Box>
        )}

        {/* Action Buttons */}
        <Group align="right" mt="md">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            leftSection={<IconUpload size={16} />}
            onClick={handleImport}
            loading={isUploading}
            disabled={!file || isUploading}
          >
            {useBatchProcessing ? "Start Background Processing" : "Import"}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default CSVImportModal;
