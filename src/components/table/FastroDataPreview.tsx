"use client";
import { Card, Table, Text, Title, Divider, Box } from "@mantine/core";
import FastroSuperCell, { type CellVariants } from "@/utils/FastroSuperCell";
import type { ColumnVariantMap } from "@/utils/FastroColumnGenerator";

type FastroDataPreviewProps<T extends object> = {
  data: T;
  columnVariants?: ColumnVariantMap<T>;
  title?: string;
  layout?: "table" | "card" | "grid";
  excludeFields?: (keyof T)[];
  labelMap?: Partial<Record<keyof T, string>>;
};

function FastroDataPreview<T extends object>({
  data,
  columnVariants = {} as ColumnVariantMap<T>,
  title = "Data Preview",
  layout = "table",
  excludeFields = [],
  labelMap = {},
}: FastroDataPreviewProps<T>) {
  // Filter out excluded fields
  const fields = Object.keys(data).filter(
    (key) => !excludeFields.includes(key as keyof T)
  );

  // Format field label
  const formatLabel = (key: string) => {
    if (key in labelMap) {
      return labelMap[key as keyof T];
    }
    return (
      key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

  // Render cell with FastroSuperCell
  const renderCell = (key: string, value: any) => {
    const variant = (columnVariants as any)[key] || "custom";
    return <FastroSuperCell value={value} variant={variant as CellVariants} />;
  };

  if (layout === "table") {
    return (
      <Card withBorder p="md">
        {title && (
          <>
            <Title order={4} mb="md">
              {title}
            </Title>
            <Divider mb="md" />
          </>
        )}
        <Table>
          <tbody>
            {fields.map((key) => (
              <tr key={key}>
                <td>
                  <Text fw={500}>{formatLabel(key)}</Text>
                </td>
                <td>{renderCell(key, (data as any)[key])}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    );
  }

  if (layout === "card") {
    return (
      <Card withBorder p="md">
        {title && (
          <>
            <Title order={4} mb="md">
              {title}
            </Title>
            <Divider mb="md" />
          </>
        )}
        <div className="space-y-4">
          {fields.map((key) => (
            <div key={key}>
              <Text size="sm" color="dimmed" mb={4}>
                {formatLabel(key)}
              </Text>
              <Box>{renderCell(key, (data as any)[key])}</Box>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Grid layout
  return (
    <Card withBorder p="md">
      {title && (
        <>
          <Title order={4} mb="md">
            {title}
          </Title>
          <Divider mb="md" />
        </>
      )}
      <div className="grid grid-cols-2 gap-4">
        {fields.map((key) => (
          <div key={key} className="p-3 border rounded">
            <Text size="sm" color="dimmed" mb={2}>
              {formatLabel(key)}
            </Text>
            <Box>{renderCell(key, (data as any)[key])}</Box>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default FastroDataPreview;
