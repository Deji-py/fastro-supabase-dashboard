"use client";
import React, { useMemo, memo } from "react";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { ColumnVariantMap } from "@/utils/FastroColumnGenerator";

// Define Resources type
type ResourceData = {
  id?: string;
  title?: string;
  file_url?: string;
  file_type?: string;
  file_size?: number;
  image?: string;
  created_at?: string;
};

// Template for form
const template = {
  title: "",
  file_url: "",
  file_type: "",
  file_size: 0,
  image: "",
  created_at: "",
};

// Column variant mapping for Input Type
const columnVariants: ColumnVariantMap<ResourceData> = {
  created_at: "date",
  image: "image",
};

const ResourcesTable = memo(() => {
  const {
    data: resources,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<ResourceData>({
    tableName: "resources",
    returning: `${getColumnsForQuery(template, ["id"])}`,
  });

  const transformedData = useMemo(() => {
    return resources.map((resource) => {
      return {
        ...resource, // Spread the rest of the properties
      };
    });
  }, [resources]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as ResourceData[]}
        columnVariants={columnVariants}
        enableEdit
        title="📂 Resources"
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

export default ResourcesTable;
