"use client";
import React, { useMemo, memo } from "react";
import { Container } from "@mantine/core";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { ColumnVariantMap } from "@/utils/FastroColumnGenerator";
import FastroTable from "@/components/table/FastroTable";

// Define Billing type
type BillingData = {
  id?: string;
  created_at?: string;
  credits?: number;
  amount?: number;
  currency?: string;
};

// Template for form
const template = {
  id: "",
  credits: 0,
  amount: 0,
  currency: "",
  created_at: "",
};

// Column variant mapping for Input Type
const columnVariants: ColumnVariantMap<BillingData> = {
  created_at: "date",
};

const PaymentSettings = memo(() => {
  const {
    data: billingRecords,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<BillingData>({
    tableName: "billing",
    returning: `${getColumnsForQuery(template, ["id"])}`,
  });

  const transformedData = useMemo(() => {
    return billingRecords.map((record) => {
      return {
        ...record, // Spread the rest of the properties
      };
    });
  }, [billingRecords]);

  return (
    <Container size="xl" pt={"md"} fluid>
      <FastroTable
        data={transformedData as BillingData[]}
        columnVariants={columnVariants}
        enableEdit
        title="💳 Payment Settings"
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

export default PaymentSettings;
