"use client";

import {
  TextInput,
  Checkbox,
  NumberInput,
  PasswordInput,
  Textarea,
  Select,
  MultiSelect,
  RadioGroup,
  Radio,
  Switch,
  FileInput,
  Avatar,
  Group,
  Box,
  Text,
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import FastroRichEditor from "./FastroRichEditor";

export type InputType =
  | "input"
  | "password"
  | "number"
  | "checkbox"
  | "textarea"
  | "select"
  | "multi-select"
  | "dropdown"
  | "radio"
  | "switch"
  | "avatar"
  | "string"
  | "number"
  | "bigint"
  | "boolean"
  | "symbol"
  | "undefined"
  | "object"
  | "function"
  | "rich-editor";

type Option = { label: string; value: string };

export type FastroInputProps = {
  input_type: InputType;
  label: string;
  name: string;
  form: UseFormReturnType<any>;
  placeholder?: string;
  options?: Option[];
  disabled?: boolean;
  required?: boolean;
};

function FastroInput({
  input_type,
  label,
  name,
  form,
  placeholder,
  options = [],
  disabled = false,
  required = false,
}: FastroInputProps) {
  const inputProps = form.getInputProps(name);

  if (
    input_type !== "checkbox" &&
    input_type !== "switch" &&
    inputProps.value === undefined
  ) {
    inputProps.value = "";
  }

  const commonProps = {
    label,
    disabled,
    required,
    ...inputProps,
  };

  const inputKey = form.key(name);

  switch (input_type) {
    case "input":
    case "string":
      return (
        <TextInput
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          {...commonProps}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
      );

    case "password":
      return (
        <PasswordInput
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          {...commonProps}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
      );

    case "number":
      return (
        <NumberInput
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          {...commonProps}
          value={typeof commonProps.value === "number" ? commonProps.value : ""}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
      );

    case "textarea":
      return (
        <Textarea
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          {...commonProps}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        />
      );

    case "checkbox":
      return (
        <Checkbox
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          label={label}
          {...form.getInputProps(name, { type: "checkbox" })}
          checked={!!form.values[name]}
          disabled={disabled}
        />
      );

    case "switch":
      return (
        <Switch
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          label={label}
          {...form.getInputProps(name, { type: "checkbox" })}
          checked={!!form.values[name]}
          disabled={disabled}
        />
      );

    case "select":
    case "dropdown":
      return (
        <Select
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          data={options}
          placeholder={placeholder || `Select ${label.toLowerCase()}`}
          {...commonProps}
          value={commonProps.value || null}
          searchable
          clearable
        />
      );

    case "multi-select":
      return (
        <MultiSelect
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          data={options}
          placeholder={placeholder || `Select ${label.toLowerCase()}`}
          {...commonProps}
          value={Array.isArray(commonProps.value) ? commonProps.value : []}
          searchable
          clearable
        />
      );

    case "radio":
      return (
        <RadioGroup
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          {...commonProps}
          value={commonProps.value || ""}
        >
          {options.map((option) => (
            <Radio
              key={option.value}
              value={option.value}
              label={option.label}
              disabled={disabled}
            />
          ))}
        </RadioGroup>
      );

    case "avatar": {
      const value = form.values[name] as
        | { src?: string; profile_pic?: string; name?: string }
        | string;

      const src =
        typeof value === "object"
          ? value?.src || value?.profile_pic
          : typeof value === "string"
          ? value
          : undefined;

      const displayName = typeof value === "object" ? value?.name : "";

      return (
        <Box key={inputKey}>
          <Text size="sm" mb={5} style={{ textTransform: "capitalize" }}>
            {label}
          </Text>
          <Group>
            <Avatar src={src} size="lg" radius="xl" />
            <Box style={{ flex: 1 }}>
              <FileInput
                size="sm"
                placeholder="Click to Upload Image"
                disabled={disabled}
                onChange={(file) => {
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onload = () => {
                    form.setFieldValue(name, {
                      src: reader.result as string,
                      name: displayName || file.name,
                      profile_pic: reader.result as string,
                    });
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <TextInput
                mt={5}
                size="sm"
                placeholder="Display Name"
                value={displayName || ""}
                onChange={(e) => {
                  const newValue = {
                    ...(typeof value === "object" ? value : {}),
                    name: e.target.value,
                  };
                  form.setFieldValue(name, newValue);
                }}
                disabled={disabled}
              />
            </Box>
          </Group>
          {inputProps.error && (
            <Text c="red" size="xs" mt={5}>
              {inputProps.error}
            </Text>
          )}
        </Box>
      );
    }

    case "rich-editor":
      return (
        <Box key={inputKey}>
          <FastroRichEditor
            key={inputKey}
            value={inputProps.value}
            onChange={(newValue: string) => form.setFieldValue(name, newValue)} // Update form field value
          />
        </Box>
      );

    case "bigint":
    case "boolean":
      return (
        <TextInput
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          label={label}
          value={String(commonProps.value)}
          readOnly
          placeholder={placeholder || label}
        />
      );

    case "symbol":
    case "function":
    case "object":
      return (
        <Textarea
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          label={label}
          readOnly
          value={
            commonProps.value === null || commonProps.value === undefined
              ? ""
              : typeof commonProps.value === "object"
              ? JSON.stringify(commonProps.value, null, 2)
              : String(commonProps.value)
          }
          placeholder={`Unsupported input type: ${input_type}`}
        />
      );

    case "undefined":
      return (
        <TextInput
          key={inputKey}
          style={{
            textTransform: "capitalize",
          }}
          label={label}
          value=""
          readOnly
          placeholder="No value (undefined)"
        />
      );

    default:
      return null;
  }
}

export default FastroInput;
