"use client";
import React, { useMemo, memo } from "react";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { ColumnVariantMap } from "@/utils/FastroColumnGenerator";

// Define FeaturesRoadmap type
type FeaturesRoadmap = {
  id?: string;
  cover_image?: string;
  title?: string;
  description?: string;
  expected_launch_date?: string;
  status?: string;
  created_at?: string;
};

// Template for form
const template = {
  cover_image: "",
  title: "",
  description: "",
  expected_launch_date: "",
  status: "",
  created_at: "",
};

// Column variant mapping
const columnVariants: ColumnVariantMap<FeaturesRoadmap> = {
  cover_image: "image",
  expected_launch_date: "date",
  created_at: "date",
};

const FeaturesRoadmapTable = memo(() => {
  const {
    data,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<FeaturesRoadmap>({
    tableName: "features_roadmap",
    returning: `${getColumnsForQuery(template, ["id"])}`,
  });

  const transformedData = useMemo(() => {
    return data.map((item) => ({
      ...item,
    }));
  }, [data]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as FeaturesRoadmap[]}
        columnVariants={columnVariants}
        enableEdit
        title="🚀 Features Roadmap"
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

export default FeaturesRoadmapTable;
