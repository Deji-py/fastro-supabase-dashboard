"use client";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { useMemo, memo } from "react";

// Define Category type
type Category = {
  id?: string;
  name?: string;
  icon?: any;
};

const template = {
  id: "",
  name: "",
  icon: "",
};

const columnVariants: ColumnVariantMap<Category> = {
  icon: "icon",
};

const CategoriesTable = memo(() => {
  const {
    data: categories,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<Category>({
    tableName: "categories",
    returning: getColumnsForQuery(template, ["id", "name", "icon"]),
  });

  const transformedData = useMemo(() => {
    return categories.map((category) => ({
      ...category,
    }));
  }, [categories]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as Category[]}
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

export default CategoriesTable;
