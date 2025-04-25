"use client";

import { useMemo } from "react";
import { Button, Divider, Stack, Group } from "@mantine/core";
import { z } from "zod";
import {
  variantShapes,
  getInputTypeFromVariant,
} from "@/helpers/VariantShapes";
import FastroInput, { type FastroInputProps } from "@/utils/FastroInput";
import type { CellVariants } from "@/utils/FastroSuperCell";
import FormValidator from "@/utils/FormValidator";
import type { UseFormReturnType } from "@mantine/form";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";

type DropdownOption = { value: string; label: string };

type DropdownOptions = {
  field: string;
  options: DropdownOption[];
}[];

type FastroDataEditorProps<T extends object> = {
  data: T;
  columnDef: ColumnVariantMap<T>;
  dropdownOptions?: DropdownOptions;
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  readOnly?: boolean;
};

function FastroDataEditor<T extends object>({
  data,
  columnDef,
  dropdownOptions = [],
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  readOnly = false,
}: FastroDataEditorProps<T>) {
  // Create a map of dropdown options by field name
  const dropdownMap = useMemo(() => {
    const map: Record<string, DropdownOption[]> = {};
    dropdownOptions.forEach(({ field, options }) => {
      map[field] = options;
    });
    return map;
  }, [dropdownOptions]);

  // Generate schema based on column definitions and data types
  const generateSchema = () => {
    const schema: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      const variant = (columnDef as any)[key] as CellVariants;

      switch (variant) {
        case "email":
          schema[key] = z.string().email("Invalid email address");
          break;
        case "phone":
          schema[key] = z.string().min(10, "Phone number is too short");
          break;
        case "currency":
        case "percentage":
        case "progress":
        case "rating":
          schema[key] = z
            .number()
            .optional()
            .or(
              z
                .string()
                .transform((val) => (val === "" ? undefined : Number(val)))
            );
          break;
        case "boolean":
          schema[key] = z.boolean().optional();
          break;
        case "avatar":
          schema[key] = z.any();
          break;
        default:
          if (typeof value === "number") {
            schema[key] = z
              .number()
              .optional()
              .or(
                z
                  .string()
                  .transform((val) => (val === "" ? undefined : Number(val)))
              );
          } else if (typeof value === "boolean") {
            schema[key] = z.boolean().optional();
          } else if (value === null || value === undefined) {
            schema[key] = z.any().optional();
          } else {
            schema[key] = z.string().optional();
          }
      }
    });

    return z.object(schema);
  };

  // Normalize data for the form
  const normalizeData = () => {
    const normalized: Record<string, any> = {};

    Object.entries(data).forEach(([key, value]) => {
      const variant = ((columnDef as any)[key] as CellVariants) || "custom";
      const normalizer = variantShapes[variant];
      normalized[key] = normalizer ? normalizer(value) : value;
    });

    return normalized;
  };

  // Create input components based on column definitions
  const createInputComponent = (
    key: string,
    value: any,
    form: UseFormReturnType<any>
  ) => {
    const variant = ((columnDef as any)[key] as CellVariants) || "custom";
    const inputType = getInputTypeFromVariant(variant, value);

    const inputProps: FastroInputProps = {
      form,
      input_type: inputType as any,
      name: key,
      label:
        key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
      disabled: readOnly,
    };

    // Add dropdown options if available
    if (
      dropdownMap[key] &&
      (inputType === "select" || inputType === "dropdown")
    ) {
      inputProps.options = dropdownMap[key];
    }

    return <FastroInput key={key} {...inputProps} />;
  };

  const handleSubmit = (values: any) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <div>
      <Divider mb={10} />
      <FormValidator initialValues={normalizeData()} schema={generateSchema()}>
        {({ form }) => (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              {Object.entries(data).map(([key, value]) =>
                createInputComponent(key, value, form)
              )}
            </Stack>
            <Group align="right" mt={20}>
              {onCancel && (
                <Button variant="outline" onClick={onCancel}>
                  {cancelLabel}
                </Button>
              )}
              <Button type="submit" disabled={readOnly}>
                {submitLabel}
              </Button>
            </Group>
          </form>
        )}
      </FormValidator>
    </div>
  );
}

export default FastroDataEditor;
