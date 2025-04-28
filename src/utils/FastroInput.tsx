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
  ColorInput,
  Button,
  // Add this import
} from "@mantine/core";
import type { UseFormReturnType } from "@mantine/form";
import FastroRichEditor from "./FastroRichEditor";
import { DateTimePicker } from "@mantine/dates";
import EmailListSelect from "./input_components/EmailListInput";

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
  | "rich-editor"
  | "color"
  | "date"
  | "image"
  | "email-list-input";

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
          style={{ textTransform: "capitalize" }}
          {...commonProps}
          value={commonProps.value ?? ""} // <-- ensure it's never null
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

    case "color":
      return (
        <ColorInput
          {...commonProps}
          description="Select a Color"
          placeholder="Pick a color"
        />
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
        />
      );

    case "date":
      // Handle the value and ensure it's a valid Date object
      const dateValue = commonProps.value ? new Date(commonProps.value) : null;

      // Check if the value is a valid date
      const isValidDate =
        dateValue instanceof Date && !isNaN(dateValue.getTime());

      return (
        <DateTimePicker
          {...commonProps}
          placeholder={placeholder || `Select ${label.toLowerCase()}`}
          value={isValidDate ? dateValue : null} // Ensure we pass a valid Date object or null
          onChange={(date) => {
            // Handle onChange if needed
            form.setFieldValue(name, date);
          }}
        />
      );
    case "image":
      // Get the image as a base64 string (or URL if needed)
      const imageValue = form.values[name] as string;

      return (
        <Box key={inputKey}>
          <Text size="sm" mb={5} style={{ textTransform: "capitalize" }}>
            {label}
          </Text>

          {/* Image Box with aspect ratio */}
          <Box
            style={{
              position: "relative",
              width: "100%",
              paddingTop: "56.25%", // 16:9 aspect ratio
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {imageValue ? (
              <img
                src={imageValue} // Using the base64 string or URL
                alt="Uploaded"
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Ensures the image fits the aspect ratio
                }}
              />
            ) : (
              <Text
                c="gray"
                style={{
                  textAlign: "center",
                  position: "absolute",
                  top: "10%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                No image uploaded
              </Text>
            )}

            {/* Button Overlay for Uploading Image */}
            <Button
              variant="light"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
              onClick={() => document.getElementById(name)?.click()} // Trigger FileInput click
            >
              Upload Image
            </Button>

            <FileInput
              id={name}
              size="sm"
              style={{ display: "none" }} // Hide the FileInput
              onChange={(file) => {
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                  form.setFieldValue(name, reader.result as string); // Store the base64 string
                };
                reader.readAsDataURL(file); // Read the file as a base64 string
              }}
              disabled={disabled}
            />
          </Box>

          {/* Image Name Input */}
          <TextInput
            mt={5}
            size="sm"
            placeholder="Image Name"
            value={imageValue || ""}
            onChange={(e) => form.setFieldValue(name, e.target.value)} // Update the base64 string
            disabled={disabled}
          />

          {inputProps.error && (
            <Text c="red" size="xs" mt={5}>
              {inputProps.error}
            </Text>
          )}
        </Box>
      );

    case "email-list-input":
      return (
        <EmailListSelect
          label={label}
          placeholder={placeholder || `Select ${label.toLowerCase()}`}
          onChange={(value: string[]) => form.setFieldValue(name, value)} // Set selected email IDs to form
          disabled={disabled}
        />
      );

    default:
      return null;
  }
}

export default FastroInput;
