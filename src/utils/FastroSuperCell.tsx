import {
  Avatar,
  Badge,
  Progress,
  Group,
  Text,
  Image,
  Tooltip,
  Flex,
} from "@mantine/core";

import {
  IconCheck,
  IconX,
  IconLoader,
  IconStar,
  IconShieldCheck,
  IconMapPin,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import moment from "moment";

export type CellVariants =
  | "avatar"
  | "badge"
  | "progress"
  | "status"
  | "icon"
  | "date"
  | "rating"
  | "flag"
  | "verified"
  | "currency"
  | "percentage"
  | "email"
  | "phone"
  | "username"
  | "image"
  | "tag"
  | "boolean"
  | "role"
  | "location"
  | "custom"
  | "rich-editor"; // Add "rich-editor" variant

type FastroSuperCellProps = {
  variant: CellVariants;
  value: any;
  options?: any;
};

function FastroSuperCell({ variant, value, options }: FastroSuperCellProps) {
  // Handle null or undefined values gracefully
  if (value === null || value === undefined) {
    return <Text c="dimmed">—</Text>;
  }

  switch (variant) {
    case "avatar":
      return (
        <Group>
          <Avatar src={value.src || value.profile_pic} radius="xl" size="sm" />
          <Text size="sm">{value.name}</Text>
        </Group>
      );

    case "badge":
      // Handle case where value is an object with label and color properties
      if (typeof value === "object" && value !== null) {
        return (
          <Badge color={value.color || "gray"} variant="light">
            {value.label || JSON.stringify(value)}
          </Badge>
        );
      }
      return (
        <Badge color="gray" variant="light">
          {String(value)}
        </Badge>
      );

    case "progress":
      return <Progress value={value} w={100} size="sm" radius="xl" />;

    case "status": {
      const defaultStatuses = {
        complete: {
          icon: <IconCheck color="green" size={16} />,
          color: "green",
        },
        pending: {
          icon: (
            <IconLoader color="orange" size={16} className="animate-spin" />
          ),
          color: "orange",
        },
        failed: { icon: <IconX color="red" size={16} />, color: "red" },
      };

      const statusOptions = options?.statusMap || defaultStatuses;
      const current = statusOptions[value] || { icon: null, color: "gray" };

      return (
        <Group gap="xs">
          {current.icon}
          <Text c={current.color}>{value}</Text>
        </Group>
      );
    }

    case "icon":
      return value;

    case "date":
      return <Text>{moment(new Date(value)).format("ll")}</Text>;

    case "rating":
      return (
        <Group gap={2}>
          {Array.from({ length: Number(value) }).map((_, i) => (
            <IconStar key={i} size={16} color="gold" />
          ))}
        </Group>
      );

    case "flag":
      return <Text fz="xl">{value}</Text>;

    case "verified":
      return (
        <Group gap="xs">
          <IconShieldCheck size={16} color="green" />
          <Text c="green">Verified</Text>
        </Group>
      );

    case "currency":
      return <Text>${Number(value).toFixed(2)}</Text>;

    case "percentage":
      return <Text>{value}%</Text>;

    case "email":
      return (
        <Tooltip label={`Send mail to ${value}`}>
          <a href={`mailto:${value}`}>
            <Flex align="center" gap="xs">
              <IconMail size={14} />
              <Text>{value}</Text>
            </Flex>
          </a>
        </Tooltip>
      );

    case "phone":
      return (
        <a href={`tel:${value}`}>
          <Group gap="xs">
            <IconPhone size={14} />
            <Text>{value}</Text>
          </Group>
        </a>
      );

    case "username":
      return <Text>@{value}</Text>;

    case "image":
      return (
        <Image
          src={value || "/placeholder.svg"}
          alt=""
          width={40}
          height={40}
          radius="md"
          fit="cover"
        />
      );

    case "tag":
      return <Badge color="blue">{value}</Badge>;

    case "boolean":
      return <Text c={value ? "green" : "red"}>{value ? "Yes" : "No"}</Text>;

    case "role":
      return <Badge variant="light">{value}</Badge>;

    case "location":
      return (
        <Group gap="xs">
          <IconMapPin size={14} />
          <Text>{value}</Text>
        </Group>
      );

    case "rich-editor":
      // For "rich-editor" variant, we will render the value as HTML and limit the text size for display purposes.
      return (
        <div
          style={{
            maxHeight: "40px", // Adjust height to your preference
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: "1.4",
            padding: "5px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#f9f9f9",
          }}
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );

    case "custom":
      if (typeof value === "function") return value();
      if (typeof value === "object" && value !== null)
        return JSON.stringify(value);
      return value;

    default:
      if (typeof value === "object" && value !== null)
        return JSON.stringify(value);
      return <Text>{String(value)}</Text>;
  }
}

export default FastroSuperCell;
