"use client";
import { Box, Container, Paper, Tabs } from "@mantine/core";
import { useMemo, memo } from "react";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import FastroTable from "@/components/table/FastroTable";
import { ModalsProvider } from "@mantine/modals";
import UserDataPreview from "@/components/molecules/blocks/users/UserDataPreview";
import { IconMail, IconStar, IconUser, IconUserX } from "@tabler/icons-react";

// Define User type with strict typing
export type UserData = {
  id: string;
  profile_pic: {
    src: string;
    name: string;
  };
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
  plan: string;
  user_business_info: {
    id: number;
    created_at: string;
    company_name?: string;
    industry?: string;
    short_intro?: string;
    city?: string;
    state?: string;
    country?: string;
    social_url?: Record<string, any>;
    website?: string;
    vat_gst?: string;
    image_url?: string;
    user_id: string;
  };
};

// Template For Form - Memoized to prevent recreation
const template = {
  profile_pic: {
    src: "",
    name: "",
  },
  firstname: "",
  lastname: "",
  email: "",
  sector: "",
  jobTitle: "",
  companyName: "",
  mobile: "",
  credits: 0,
  plan: "",
} as const;

// Column variant mapping - Memoized to prevent recreation
const columnVariants: ColumnVariantMap<UserData> = {
  email: "email",
  profile_pic: "avatar",
  plan: "badge",
  created_at: "date",
} as const;

// Memoized dropdown options
const dropdownOptions = [
  {
    field: "plan",
    options: [
      { value: "free", label: "Free" },
      { value: "premium", label: "Premium" },
    ],
  },
] as const;

const UsersPage = memo(() => {
  const {
    data: users,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
  } = useFastroTable<UserData>({
    tableName: "users",
    returning: `${getColumnsForQuery(template, [
      "user_id",
      "id",
    ])}, user_business_info(*) `,
  });

  // Transform data with stable references
  const transformedData = useMemo(() => {
    if (!users) return [];

    return (users as UserData[]).map((user) => {
      const { user_business_info, profile_pic, firstname, lastname, ...rest } =
        user;

      return {
        profile_pic: {
          src: profile_pic,
          name: `${firstname || ""} ${lastname || ""}`.trim() || "No Name",
        },
        firstname,
        lastname,
        ...rest, // Spread the rest of the properties
      };
    });
  }, [users]);

  // Group users into free and premium plans
  const freeUsers = useMemo(
    () => transformedData.filter((user) => user.plan === "free"),
    [transformedData]
  );
  const premiumUsers = useMemo(
    () => transformedData.filter((user) => user.plan === "premium"),
    [transformedData]
  );

  return (
    <ModalsProvider>
      <Container size="xl" fluid py="xl">
        <Tabs defaultValue="free">
          <Paper radius="md" pt="md" mb={10} withBorder>
            <Tabs.List>
              <Tabs.Tab value="free" leftSection={<IconUser size={16} />}>
                Free Plan
              </Tabs.Tab>
              <Tabs.Tab value="premium" leftSection={<IconStar size={16} />}>
                Premium Plan
              </Tabs.Tab>
            </Tabs.List>
          </Paper>

          <Tabs.Panel value="free">
            <FastroTable
              data={freeUsers as any}
              columnVariants={columnVariants}
              title="Free Plan Users"
              enableEdit
              enableCreate
              enableDelete={true}
              enableRowSelection
              loading={isLoading}
              onRowCreate={handleCreateRow}
              onRowUpdate={handleUpdateRow as any}
              onRowDelete={handleDeleteRow as any}
              onBulkDelete={handleBulkDelete as any}
              dropdownOptions={dropdownOptions as any}
              createTemplate={template}
              customPreview={UserDataPreview}
              customRowActions={[
                {
                  label: "Send Email",
                  icon: <IconMail size={16} />,
                  onClick: (row) => console.log("Send email to", row),
                },
                {
                  label: "Suspend User",
                  icon: <IconUserX size={16} />,
                  color: "yellow",
                  onClick: (row) => console.log("Suspend", row),
                },
              ]}
            />
          </Tabs.Panel>

          <Tabs.Panel value="premium">
            <FastroTable
              data={premiumUsers as any}
              columnVariants={columnVariants}
              title="Premium Plan Users"
              enableEdit
              enableCreate
              enableDelete={true}
              enableRowSelection
              loading={isLoading}
              onRowCreate={handleCreateRow}
              onRowUpdate={handleUpdateRow as any}
              onRowDelete={handleDeleteRow as any}
              onBulkDelete={handleBulkDelete as any}
              dropdownOptions={dropdownOptions as any}
              createTemplate={template}
              customPreview={UserDataPreview}
              customRowActions={[
                {
                  label: "Send Email",
                  icon: <IconMail size={16} />,
                  onClick: (row) => console.log("Send email to", row),
                },
                {
                  label: "Suspend User",
                  icon: <IconUserX size={16} />,
                  color: "yellow",
                  onClick: (row) => console.log("Suspend", row),
                },
              ]}
            />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </ModalsProvider>
  );
});

// Add display name for better debugging
UsersPage.displayName = "UsersPage";

export default UsersPage;
