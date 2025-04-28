"use client";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { useMemo, memo } from "react";

// Define Industry type
type Industry = {
  id?: string;
  image?: any;
  name?: string;
  icon?: any;
  content?: string;
  slug?: string;
  description?: string;
};

const template = {
  image: "",
  id: "",
  name: "",
  icon: "",
  content: "",
  slug: "",
  description: "",
};

const columnVariants: ColumnVariantMap<Industry> = {
  image: "image",
  content: "rich-editor",
  icon: "icon",
};

const IndustriesTable = memo(() => {
  const {
    data: industries,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<Industry>({
    tableName: "industries",
    returning: getColumnsForQuery(template, ["id"]),
  });

  const transformedData = useMemo(() => {
    return industries.map((industry) => ({
      image: industry.image,
      ...industry,
    }));
  }, [industries]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as Industry[]}
        columnVariants={columnVariants}
        enableCreate
        enableEdit
        enableDelete
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

export default IndustriesTable;
