"use client";
import React, { useMemo, memo } from "react";
import { Container } from "@mantine/core";
import FastroTable from "@/components/table/FastroTable";
import useFastroTable from "@/hooks/useFastroTable";
import { getColumnsForQuery } from "@/helpers/getexcludedFromType";
import { ColumnVariantMap } from "@/utils/FastroColumnGenerator";

// Define Case Study type
type CaseStudyData = {
  id?: string;
  title?: string;
  slug?: string;
  image?: string;
  content?: string;
  created_at?: string;
};

// Template for form
const template = {
  title: "",
  slug: "",
  image: "",
  content: "",
  created_at: "",
};

// Column variant mapping for Input Type
const columnVariants: ColumnVariantMap<CaseStudyData> = {
  created_at: "date",
  image: "image",
  content: "rich-editor",
};

const CaseStudies = memo(() => {
  const {
    data: caseStudies,
    handleBulkDelete,
    handleCreateRow,
    handleUpdateRow,
    handleDeleteRow,
    isLoading,
    isError,
  } = useFastroTable<CaseStudyData>({
    tableName: "case-studies",
    returning: `${getColumnsForQuery(template, ["id"])}`,
  });

  const transformedData = useMemo(() => {
    return caseStudies.map((caseStudy) => {
      return {
        ...caseStudy,
      };
    });
  }, [caseStudies]);

  return (
    <Container size="xl" fluid>
      <FastroTable
        data={transformedData as CaseStudyData[]}
        columnVariants={columnVariants}
        enableEdit
        title="📚 Case Studies"
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

export default CaseStudies;
