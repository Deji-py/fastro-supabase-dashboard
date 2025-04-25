"use client";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import useFastroTable from "@/hooks/useFastroTable";
import FastroEmptyState from "@/components/table/FastroEmptyState";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";

// Define your data type
type User = {
  id: string;
  firstname: string;
  user_id: string;
  lastname: string;
  email: string;
  sector: string;
  jobTitle: string;
  companyName: string;
  mobile: string;
  credits: number;
  created_at: string;
};

// Template For Form
const template = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  sector: "",
  jobTitle: "",
  companyName: "",
  mobile: "",
  credits: 0,
};

// Column variant mapping for Input Type
const columnVariants: ColumnVariantMap<User> = {
  email: "email",
};

export default function UsersPage() {
  const {
    data: users, // Default to empty array if undefined
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<User>({
    tableName: "users",
    returning: getColumnsForQuery(template, ["user_id", "created_at"]),
  });

  return (
    <Container size="xl" fluid py="xl">
      <FastroTable
        data={users}
        columnVariants={columnVariants}
        title="User Management"
        enableCreate={true}
        enableEdit={true}
        enableDelete={true}
        enableRowSelection={true}
        onRowCreate={handleCreateRow}
        onRowUpdate={handleUpdateRow}
        onRowDelete={handleDeleteRow}
        onBulkDelete={handleBulkDelete}
        editableColumns={["id", "companyName", "created_at"]}
        dropdownOptions={[
          {
            field: "gender",
            options: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "nonbinary", label: "Non-binary" },
            ],
          },
          {
            field: "status",
            options: [
              { value: "complete", label: "Complete" },
              { value: "pending", label: "Pending" },
              { value: "failed", label: "Failed" },
            ],
          },
        ]}
        // Template for Form
        createTemplate={template}
        emptyState={
          <FastroEmptyState
            isLoading={isLoading}
            isError={isError}
            errorMessage="Error loading users. Please try again."
            onCreateClick={() => {
              /* Open create modal or retry fetching data */
            }}
          />
        }
      />
    </Container>
  );
}
