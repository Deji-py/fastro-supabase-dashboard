"use client";

import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { useMemo, memo } from "react";

// Define Business type
type Business = {
  id?: number;
  company_name?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  mailing_address?: string;
  primary_city?: string;
  primary_state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  web_address?: string;
  email?: string;
  revenue?: string;
  employee?: string;
  industry?: string;
  sub_industry?: string;
  linkedin?: string;
};

// Template For Form
const template: Business = {
  id: undefined,
  company_name: "",
  first_name: "",
  last_name: "",
  title: "",
  mailing_address: "",
  primary_city: "",
  primary_state: "",
  zip_code: "",
  country: "",
  phone: "",
  web_address: "",
  email: "",
  revenue: "",
  employee: "",
  industry: "",
  sub_industry: "",
  linkedin: "",
};

// Column variant mapping (optional)
const columnVariants: ColumnVariantMap<Business> = {
  email: "email",
  linkedin: "boolean",
};

// Dropdown options (optional for fields like industry/sub_industry if needed)
// const dropDownOptions = [];

const BusinessesTable = memo(() => {
  const {
    data: businesses,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<Business>({
    tableName: "business",
    returning: getColumnsForQuery(template, ["id"]),
  });

  const transformedData = useMemo(() => {
    return businesses.map((business) => ({
      ...business,
    }));
  }, [businesses]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as Business[]}
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

export default BusinessesTable;
