"use client";

import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { useMemo, memo } from "react";

// Define Investor type
type Investor = {
  id?: number;
  firstname?: string;
  emails?: string;
  website?: string;
  companies?: string;
  facebook_link?: string;
  founding_year?: number;
  fund_description?: string;
  fund_focus?: string;
  fund_stage?: string;
  fund_type?: string;
  linkedin_link?: string;
  location?: string;
  number_of_Investments?: number;
  portfolio_companies?: string;
};

// Template For Form
const template: Investor = {
  id: undefined,
  firstname: "",
  emails: "",
  website: "",
  companies: "",
  facebook_link: "",
  founding_year: undefined,
  fund_description: "",
  fund_focus: "",
  fund_stage: "",
  fund_type: "",
  linkedin_link: "",
  location: "",
  number_of_Investments: undefined,
  portfolio_companies: "",
};

// Column variant mapping
const columnVariants: ColumnVariantMap<Investor> = {
  emails: "email",
};

// Dropdown options (empty for now)
// const dropDownOptions = [];

const InvestorsTable = memo(() => {
  const {
    data: investors,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<Investor>({
    tableName: "investors",
    returning: getColumnsForQuery(template, ["id"]),
  });

  const transformedData = useMemo(() => {
    return investors.map((investor) => ({
      ...investor,
    }));
  }, [investors]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as Investor[]}
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

export default InvestorsTable;
