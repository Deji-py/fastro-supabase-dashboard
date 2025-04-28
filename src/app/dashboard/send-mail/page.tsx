"use client";
import React, { useMemo, memo } from "react";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import useFastroTable from "@/hooks/useFastroTable";
import { ColumnVariantMap } from "@/utils/FastroColumnGenerator";

// Define Sent Email type
type SentEmailData = {
  id?: string;
  subject?: string;
  description?: string;
  recipients?: string; // This will be a JSONB stringified field
  status?: string;
  created_at?: string;
  sent_at?: string;
  user_email?: string;
  user_firstname?: string;
  user_lastname?: string;
  user_profile_pic?: string;
  email_id?: string;
};

// Template for form
const template = {
  subject: "",
  description: "",
  recipient: "",
  created_at: "",
  sent_at: "",
};

const columnVariants: ColumnVariantMap<SentEmailData> = {
  description: "rich-editor",
  created_at: "date",
  sent_at: "date",
  recipients: "email-list",
  status: "status",
};

const SentEmails = memo(() => {
  const {
    data: sentEmails,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<SentEmailData>({
    tableName: "sent_emails",
    rpcQuery: "get_sent_emails_with_user_details",
  });

  const transformedData = useMemo(() => {
    return sentEmails.map((email) => {
      const { email_id, ...rest } = email;
      return {
        ...rest, // You can map over other fields as needed
      };
    });
  }, [sentEmails]);

  return (
    <Container size="xl" pt={"md"} fluid>
      <FastroTable
        data={transformedData as SentEmailData[]}
        columnVariants={columnVariants}
        enableEdit
        title="📧 Sent Emails"
        enableDelete
        enableCreate
        enableRowSelection
        loading={isLoading}
        dropdownOptions={[
          {
            field: "status",
            options: [
              {
                label: "Pending",
                value: "pending",
              },
            ],
          },
        ]}
        onRowCreate={handleCreateRow}
        onRowUpdate={handleUpdateRow}
        onRowDelete={handleDeleteRow}
        onBulkDelete={handleBulkDelete as any}
        createTemplate={template}
      />
    </Container>
  );
});

export default SentEmails;
