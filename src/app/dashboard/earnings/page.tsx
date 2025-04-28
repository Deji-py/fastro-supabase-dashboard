"use client";
import React, { useMemo, memo } from "react";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { ColumnVariantMap } from "@/utils/FastroColumnGenerator";

// Define Earnings type
type PaymentHistory = {
  id?: string;
  user_id?: string;
  amount?: number;
  total_credits?: number;
  status?: string;
  order_id?: string;
  disbursement_status?: string;
  created_at?: string;
  users?: any;
  profile_pic?: any;
  firstname: string;
  lastname: string;
  User?: any;
};

// Template for form
const template = {
  id: "",
  user_id: "",
  amount: 0,
  total_credits: 0,
  status: "",
  order_id: "",
  disbursement_status: "",
  created_at: "",
};

// Column variant mapping for Input Type
const columnVariants: ColumnVariantMap<PaymentHistory> = {
  amount: "currency",
  disbursement_status: "badge",
  User: "avatar",
};

const Earnings = memo(() => {
  const {
    data: payments,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<PaymentHistory>({
    tableName: "payment_history",
    returning: `${getColumnsForQuery(template, [
      "user_id",
    ])}, users(firstname, lastname, profile_pic)`,
  });

  const transformedData = useMemo(() => {
    if (!payments) return [];

    return payments.map((payment) => {
      const { users, ...rest } = payment;

      return {
        User: {
          src: users?.profile_pic || "default-profile-pic.jpg", // Use default if profile_pic is missing
          name:
            `${users?.firstname || ""} ${users?.lastname || ""}`.trim() ||
            "No Name", // Full name or default
        },

        ...rest, // Spread the rest of the properties excluding `user`
      };
    });
  }, [payments]);

  return (
    <Container size="xl" pt={"md"} fluid>
      <FastroTable
        data={transformedData as PaymentHistory[]}
        columnVariants={columnVariants}
        enableEdit
        title="🪙Earnings"
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

export default Earnings;
