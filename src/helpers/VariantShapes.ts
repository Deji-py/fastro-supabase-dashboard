import { CellVariants } from "@/utils/FastroSuperCell";

// Define normalizers for different variant types
export const variantShapes: Record<string, (value: any) => any> = {
  avatar: (value) => {
    if (typeof value === "string") {
      return { src: value, name: "User Avatar" };
    }
    return value;
  },
  badge: (value) => {
    if (typeof value === "string") {
      return { label: value, color: "blue" };
    }
    return value;
  },
  status: (value) => value,
  progress: (value) =>
    typeof value === "string" ? parseInt(value, 10) : value,
  icon: (value) => value,
  date: (value) => value,
  rating: (value) => (typeof value === "string" ? parseInt(value, 10) : value),
  flag: (value) => value,
  verified: (value) => value,
  currency: (value) => (typeof value === "string" ? parseFloat(value) : value),
  percentage: (value) =>
    typeof value === "string" ? parseInt(value, 10) : value,
  email: (value) => value,
  phone: (value) => value,
  username: (value) => value,
  image: (value) => value,
  tag: (value) => value,
  boolean: (value) => {
    if (typeof value === "string") {
      return value.toLowerCase() === "true";
    }
    return Boolean(value);
  },
  role: (value) => value,
  location: (value) => value,
  custom: (value) => value,
};

// Map input types to cell variants
export const inputToCellVariantMap: Record<string, CellVariants> = {
  input: "custom",
  password: "custom",
  number: "custom",
  checkbox: "boolean",
  textarea: "custom",
  select: "badge",
  "multi-select": "tag",
  dropdown: "badge",
  radio: "badge",
  switch: "boolean",
  avatar: "avatar",
  email: "email",
  phone: "phone",
  string: "custom",
  bigint: "custom",
  boolean: "boolean",
  symbol: "custom",
  undefined: "custom",
  object: "custom",
  function: "custom",
  icon: "icon",
};

// Map cell variants to input types
export const cellVariantToInputMap: Record<CellVariants, string> = {
  avatar: "avatar",
  badge: "select",
  progress: "number",
  status: "select",
  icon: "input",
  date: "date",
  rating: "number",
  flag: "input",
  verified: "checkbox",
  currency: "number",
  percentage: "number",
  email: "input",
  phone: "input",
  username: "input",
  image: "image",
  tag: "input",
  boolean: "checkbox",
  role: "select",
  location: "input",
  custom: "input",
  "rich-editor": "rich-editor",
  color: "color",
  sentiment: "number",
  "email-list": "email-list-input",
};

// Get appropriate input type based on cell variant and value
export const getInputTypeFromVariant = (
  variant: CellVariants,
  value: any
): string => {
  // Special cases based on value type
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "checkbox";

  // Use the mapping
  return cellVariantToInputMap[variant] || "input";
};
