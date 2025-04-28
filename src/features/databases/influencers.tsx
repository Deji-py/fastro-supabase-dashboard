"use client";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { useMemo, memo } from "react";

// Define Influencer type
type Influencer = {
  id?: string;
  username?: string;
  bio?: string;
  fullName?: string;
  biography?: string;
  followerCount?: number;
  followers?: number;
  following?: number;
  mediaCount?: number;
  email?: string;
  profilePicUrl?: any;
  profilePicUrlHd?: any;
  isVerified?: any;
  isPrivate?: boolean;
  isBusiness?: boolean;
  externalUrl?: string;
  bioLinks?: string;
  category?: string;
  pronouns?: string;
  lead_id?: number;
};

// Template For Form
const template = {
  id: "",
  username: "",
  bio: "",
  fullName: "",
  biography: "",
  followerCount: 0,
  followers: 0,
  following: 0,
  mediaCount: 0,
  email: "",
  profilePicUrl: "",
  profilePicUrlHd: "",
  isVerified: false,
  isPrivate: false,
  isBusiness: false,
  externalUrl: "",
  bioLinks: "",
  category: "",
  pronouns: "",
};

// Column variant mapping for Input Type
const columnVariants: ColumnVariantMap<Influencer> = {
  email: "email",
  profilePicUrl: "avatar",
  profilePicUrlHd: "avatar",
  isVerified: "badge",
};

const dropDownOptions = [
  {
    field: "isVerified",
    options: [
      { value: "true", label: "Verified" },
      { value: "false", label: "Not Verified" },
    ],
  },
  {
    field: "isPrivate",
    options: [
      { value: "true", label: "Private" },
      { value: "false", label: "Public" },
    ],
  },
];

const InfluencersTable = memo(() => {
  const {
    data: influencers,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<Influencer>({
    tableName: "influencers",
    returning: getColumnsForQuery(template, [
      "lead_id",
      "is_private",
      "is_business",
      "id",
    ]),
  });

  const transformedData = useMemo(() => {
    return influencers.map((influencer) => ({
      ...influencer,
      profilePicUrl: {
        src: influencer.profilePicUrl,
        name: influencer.fullName || influencer.username || "No Name",
      },
      profilePicUrlHd: {
        src: influencer.profilePicUrlHd,
        name: influencer.fullName || influencer.username || "No Name",
      },
      isVerified: {
        [influencer.isVerified ? "true" : "false"]: influencer.isVerified
          ? "Verified"
          : "Unverified",
      },
    }));
  }, [influencers]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as Influencer[]}
        columnVariants={columnVariants}
        enableCreate
        enableEdit
        enableDelete
        enableCSVImport
        enableRowSelection
        loading={isLoading}
        onRowCreate={handleCreateRow}
        onRowUpdate={handleUpdateRow}
        onRowDelete={handleDeleteRow}
        onBulkDelete={handleBulkDelete as any}
        dropdownOptions={dropDownOptions}
        createTemplate={template}
      />
    </Container>
  );
});

export default InfluencersTable;
