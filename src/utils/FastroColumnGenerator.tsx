import type { MRT_ColumnDef } from "mantine-react-table";
import FastroSuperCell, { type CellVariants } from "./FastroSuperCell";
import {
  variantShapes,
  getInputTypeFromVariant,
} from "@/helpers/VariantShapes";

export type ColumnVariantMap<T> = {
  [K in keyof T]?: CellVariants;
};

// Function to generate columns for Mantine React Table
export function generateColumns<T extends object>(
  data: T[],
  variantMap: ColumnVariantMap<T> = {},
  editableColumns: (keyof T)[] = []
): MRT_ColumnDef<T>[] {
  if (data.length === 0) return [];

  return Object.keys(data[0]).map((key) => {
    const typedKey = key as keyof T;
    const variant = variantMap[typedKey] ?? "custom";
    const isEditable = editableColumns.includes(typedKey);

    // Get a sample value to determine input type
    const sampleValue = data[0][typedKey];
    const inputType = getInputTypeFromVariant(
      variant as CellVariants,
      sampleValue
    );

    return {
      accessorKey: key,
      header:
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
      enableEditing: isEditable,
      editVariant: inputType === "select" ? "select" : "text",
      mantineEditTextInputProps: {
        type: inputType === "number" ? "number" : "text",
      },
      Cell: ({ row }) => {
        const rawValue = row.original[typedKey];
        const normalizer = variantShapes[variant];
        const value = normalizer ? normalizer(rawValue) : rawValue;

        const options =
          variant === "status"
            ? {
                statusMap: {
                  complete: { icon: "✅", color: "green" },
                  pending: { icon: "⏳", color: "orange" },
                  failed: { icon: "❌", color: "red" },
                },
              }
            : undefined;

        return (
          <FastroSuperCell
            value={value}
            variant={variant as CellVariants}
            options={options}
          />
        );
      },
    };
  });
}

// Function to convert table data to form data
export function tableDataToFormData<T extends object>(
  data: T,
  variantMap: ColumnVariantMap<T> = {}
): Record<string, any> {
  const formData: Record<string, any> = {};

  Object.entries(data).forEach(([key, value]) => {
    const typedKey = key as keyof T;
    const variant = variantMap[typedKey] ?? "custom";
    const normalizer = variantShapes[variant as string];

    formData[key] = normalizer ? normalizer(value) : value;
  });

  return formData;
}

// Function to convert form data back to table data
export function formDataToTableData<T extends object>(
  formData: Record<string, any>,
  originalData: T
): T {
  const tableData = { ...originalData };

  Object.entries(formData).forEach(([key, value]) => {
    if (key in tableData) {
      (tableData as any)[key] = value;
    }
  });

  return tableData;
}
