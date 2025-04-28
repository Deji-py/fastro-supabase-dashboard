"use client";

import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { useMemo, memo } from "react";

// Define Blogger type
type Blogger = {
  id?: number;
  logo?: string;
  blog_name?: string;
  blog_url?: string;
  da?: number;
  pa?: number;
  blogger_name?: string;
  email?: string;
  category?: string;
  topics?: string;
  language?: string;
  country?: string;
  social_media?: string;
  created_at?: string;
};

// Template For Form
const template: Blogger = {
  id: undefined,
  logo: "",
  blog_name: "",
  blog_url: "",
  da: 0,
  pa: 0,
  blogger_name: "",
  email: "",
  category: "",
  topics: "",
  language: "",
  country: "",
  social_media: "",
  created_at: "",
};

// Column variant mapping
const columnVariants: ColumnVariantMap<Blogger> = {
  email: "email",
  logo: "image", // Assuming you have "image" variant for logos
};

// Dropdown options (empty for now)
// const dropDownOptions = [];

const BloggersTable = memo(() => {
  const {
    data: bloggers,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<Blogger>({
    tableName: "bloggers",
    returning: getColumnsForQuery(template, ["id"]),
  });

  const transformedData = useMemo(() => {
    return bloggers.map((blogger) => ({
      ...blogger,
    }));
  }, [bloggers]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as Blogger[]}
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

export default BloggersTable;
