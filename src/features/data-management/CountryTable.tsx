"use client";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { useMemo, memo } from "react";

// Define Country type
type Country = {
  id?: string;
  name?: string;
  flag?: any;
  image?: any;
  contacts?: string;
};

const template = {
  id: "",
  name: "",
  flag: "",
  image: "",
  contacts: "20",
};

const columnVariants: ColumnVariantMap<Country> = {
  flag: "flag",
  image: "image",
};

const CountriesTable = memo(() => {
  const {
    data: countries,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<Country>({
    tableName: "countries",
    returning: getColumnsForQuery(template, ["id"]),
  });

  const transformedData = useMemo(() => {
    return countries.map((country) => ({
      ...country,
    }));
  }, [countries]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as Country[]}
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

export default CountriesTable;
