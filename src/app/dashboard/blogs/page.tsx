"use client";
import React, { useMemo, memo } from "react";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { ColumnVariantMap } from "@/utils/FastroColumnGenerator";

// Define Blog type
type BlogData = {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  image?: string;
  created_at?: string;
};

// Template for form
const template = {
  image: "",
  title: "",
  slug: "",
  content: "",
  created_at: "",
};

// Column variant mapping for Input Type
const columnVariants: ColumnVariantMap<BlogData> = {
  content: "rich-editor",
  created_at: "date",
  image: "image",
};

const Blog = memo(() => {
  const {
    data: blogs,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<BlogData>({
    tableName: "blog",
    returning: `${getColumnsForQuery(template, ["id"])}`,
  });

  const transformedData = useMemo(() => {
    return blogs.map((blog) => {
      return {
        ...blog, // Spread the rest of the properties
      };
    });
  }, [blogs]);

  return (
    <Container size="xl" pt={"md"} fluid>
      <FastroTable
        data={transformedData as BlogData[]}
        columnVariants={columnVariants}
        enableEdit
        title="📝 Blog"
        enableDelete
        enableCreate
        enableRowSelection
        loading={isLoading}
        onRowCreate={handleCreateRow}
        onRowUpdate={handleUpdateRow}
        onRowDelete={handleDeleteRow}
        onBulkDelete={handleBulkDelete as any}
        createTemplate={template}
      />
    </Container>
  );
});

export default Blog;
