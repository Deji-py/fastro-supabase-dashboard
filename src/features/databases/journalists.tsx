"use client";

import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { useMemo, memo } from "react";

// Define Journalist type
type Journalist = {
  id?: number;
  firstname?: string;
  lastname?: string;
  title?: string;
  media_outlets?: string;
  email_address_1?: string;
  email_address_2?: string;
  x_screen_name?: string;
  x_followers?: number;
  x_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  tumblr_url?: string;
  snapchat_url?: string;
  quora_url?: string;
  instagram_url?: string;
  threads_url?: string;
  location_coverage?: string;
  beats?: string;
  bio?: string;
  media_outlet_address?: string;
  address_2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  media_outlet_phone_number?: string;
};

// Template For Form
const template: Journalist = {
  id: undefined,
  firstname: "",
  lastname: "",
  title: "",
  media_outlets: "",
  email_address_1: "",
  email_address_2: "",
  x_screen_name: "",
  x_followers: 0,
  x_url: "",
  linkedin_url: "",
  facebook_url: "",
  youtube_url: "",
  tumblr_url: "",
  snapchat_url: "",
  quora_url: "",
  instagram_url: "",
  threads_url: "",
  location_coverage: "",
  beats: "",
  bio: "",
  media_outlet_address: "",
  address_2: "",
  city: "",
  state: "",
  country: "",
  zip_code: "",
  media_outlet_phone_number: "",
};

// Column variant mapping
const columnVariants: ColumnVariantMap<Journalist> = {
  email_address_1: "email",
  email_address_2: "email",
};

// Dropdown options (empty for now)
// const dropDownOptions = [];

const JournalistsTable = memo(() => {
  const {
    data: journalists,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<Journalist>({
    tableName: "journalists",
    returning: getColumnsForQuery(template, ["id"]),
  });

  const transformedData = useMemo(() => {
    return journalists.map((journalist) => ({
      ...journalist,
    }));
  }, [journalists]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as Journalist[]}
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
        // dropdownOptions={dropDownOptions}
        createTemplate={template}
      />
    </Container>
  );
});

export default JournalistsTable;
