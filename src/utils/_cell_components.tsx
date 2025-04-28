// FastroSuperCells.tsx
import React from "react";
import {
  Avatar,
  Badge,
  Progress,
  Group,
  Text,
  Image,
  Flex,
  Rating,
  ColorSwatch,
  Stack,
} from "@mantine/core";
import {
  IconCheck,
  IconX,
  IconLoader,
  IconShieldCheck,
  IconMapPin,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";
import moment from "moment";
import { Icon } from "@iconify/react";

// ======================= //
//      CELL COMPONENTS     //
// ======================= //

export const AvatarCell = React.memo(({ value }: { value: any }) => (
  <Flex gap="md" align="center">
    <Avatar src={value.src || value.profile_pic} radius="xl" size="sm" />
    <Text size="sm">{value.name}</Text>
  </Flex>
));

export const BadgeCell = React.memo(({ value }: { value: any }) => {
  if (typeof value === "object" && value !== null) {
    const keys = ["true", "false", "neutral"] as const;
    const booleanKey = keys.find((key) => key in value);

    if (booleanKey) {
      const colorMap = {
        true: "green",
        false: "red",
        neutral: "gray",
      } as const;
      const label = value[booleanKey];
      const color = colorMap[booleanKey];

      return (
        <Badge color={color} variant="light">
          {label}
        </Badge>
      );
    }

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
});

export const SentimentCell = React.memo(({ value }: { value: any }) => {
  const score = typeof value === "number" ? value : parseFloat(value);
  const map = {
    positive: { label: "Positive", color: "green", emoji: "😊" },
    neutral: { label: "Neutral", color: "gray", emoji: "😐" },
    negative: { label: "Negative", color: "red", emoji: "😞" },
  } as const;

  const key =
    score >= 0.66 ? "positive" : score >= 0.33 ? "neutral" : "negative";
  const { label, color, emoji } = map[key];

  return (
    <Badge color={color} variant="light" leftSection={<span>{emoji}</span>}>
      {label}
    </Badge>
  );
});

export const ProgressCell = React.memo(({ value }: { value: number }) => (
  <Progress value={value} w={100} size="sm" radius="xl" />
));

export const StatusCell = React.memo(
  ({ value, options }: { value: any; options?: any }) => {
    const defaults = {
      complete: { icon: <IconCheck color="green" size={16} />, color: "green" },
      pending: {
        icon: <IconLoader color="orange" size={16} className="animate-spin" />,
        color: "orange",
      },
      failed: { icon: <IconX color="red" size={16} />, color: "red" },
    };

    const map = options?.statusMap || defaults;
    const current = map[value] || { icon: null, color: "gray" };

    return (
      <Group gap="xs">
        {current.icon}
        <Text c={current.color}>{value}</Text>
      </Group>
    );
  }
);

export const IconCell = React.memo(({ value }: { value: any }) => (
  <Icon icon={value} style={{ width: "20px", height: "20px" }} />
));

export const DateCell = React.memo(
  ({ value }: { value: string | number | Date }) => (
    <Text size="sm">{moment(new Date(value)).format("ll")}</Text>
  )
);

export const RatingCell = React.memo(({ value }: { value: number }) => (
  <Group gap={2}>
    <Rating size="xs" defaultValue={value} />
    <Text size="xs" ml={"xs"}>
      {value.toFixed(1)}/5
    </Text>
  </Group>
));

export const FlagCell = React.memo(({ value }: { value: string }) => (
  <img src={value} alt="flag-icon" style={{ width: 24 }} />
));

export const VerifiedCell = React.memo(() => (
  <Group gap="xs">
    <IconShieldCheck size={16} color="green" />
    <Text c="green">Verified</Text>
  </Group>
));

export const CurrencyCell = React.memo(({ value }: { value: number }) => (
  <Text>${Number(value).toFixed(2)}</Text>
));

export const PercentageCell = React.memo(({ value }: { value: number }) => (
  <Text>{value}%</Text>
));

export const EmailCell = React.memo(({ value }: { value: string }) => (
  <a href={`mailto:${value}`}>
    <Flex align="center" gap="xs">
      <IconMail size={14} />
      <Text size="sm">{value}</Text>
    </Flex>
  </a>
));

export const PhoneCell = React.memo(({ value }: { value: string }) => (
  <a href={`tel:${value}`}>
    <Group gap="xs">
      <IconPhone size={14} />
      <Text>{value}</Text>
    </Group>
  </a>
));

export const UsernameCell = React.memo(({ value }: { value: string }) => (
  <Text>@{value}</Text>
));

export const ImageCell = React.memo(({ value }: { value: string }) => (
  <Image
    src={value || "/placeholder.svg"}
    alt=""
    width={24}
    height={24}
    radius="md"
    fit="contain"
  />
));

export const TagCell = React.memo(({ value }: { value: string }) => (
  <Badge color="blue">{value}</Badge>
));

export const BooleanCell = React.memo(({ value }: { value: boolean }) => (
  <Text c={value ? "green" : "red"}>{value ? "Yes" : "No"}</Text>
));

export const RoleCell = React.memo(({ value }: { value: string }) => (
  <Badge variant="light">{value}</Badge>
));

export const LocationCell = React.memo(({ value }: { value: string }) => (
  <Group gap="xs">
    <IconMapPin size={14} />
    <Text>{value}</Text>
  </Group>
));

export const ColorCell = React.memo(({ value }: { value: string }) => (
  <ColorSwatch size={20} color={value.startsWith("#") ? value : `#${value}`} />
));

export const RichEditorCell = React.memo(({ value }: { value: string }) => (
  <div
    style={{
      maxHeight: "40px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      lineHeight: "1.4",
      padding: "5px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      backgroundColor: "#f9f9f9",
      maxWidth: "250px",
    }}
  >
    {value}
  </div>
));

export const CustomCell = React.memo(({ value }: { value: any }) => {
  if (typeof value === "function") {
    return value();
  }

  if (typeof value === "object" && value !== null) {
    return <Text size="sm">{JSON.stringify(value)}</Text>;
  }

  return (
    <Text lineClamp={1} truncate="end" size="sm" maw={400}>
      {value}
    </Text>
  );
});

export const EmailListCell = React.memo(({ value }: { value: any[] }) => {
  const maxItemsToShow = 5; // Max number of items to display before truncating with '4 more'
  const displayCount =
    value.length > maxItemsToShow ? maxItemsToShow : value.length;

  return (
    <Flex gap="xs">
      {/* Profile Pics Group */}
      <Avatar.Group>
        {value.slice(0, displayCount).map((item: any, index: number) => (
          <Avatar
            size="sm"
            key={index}
            src={item.src || "/placeholder.svg"}
            alt={`Profile picture of ${item.name}`}
          />
        ))}
        {value.length > maxItemsToShow && (
          <Avatar> +{value.length - maxItemsToShow}</Avatar>
        )}
      </Avatar.Group>

      {/* Usernames Display */}
      <Stack gap={1}>
        <Flex gap={4}>
          {value.slice(0, 1).map((item: any, index: number) => (
            <Text key={index} size="sm">
              @{item.name}
            </Text>
          ))}
          {value.length > 1 && (
            <Text size="sm" c="dimmed">
              +{value.length - 1} more
            </Text>
          )}
        </Flex>

        {/* Emails Display */}
        <Flex gap={4}>
          {value.slice(0, 1).map((item: any, index: number) => (
            <Flex align="center" gap="xs" key={index}>
              <IconMail size={14} />
              <Text size="xs">{item.email}</Text>
            </Flex>
          ))}
          {value.length > 1 && (
            <Text size="xs" c="dimmed">
              +{value.length - 1} more
            </Text>
          )}
        </Flex>
      </Stack>
    </Flex>
  );
});

// ======================= //
//   FALLBACK EMPTY CELL    //
// ======================= //

export const EmptyCell = React.memo(() => <Text c="dimmed">—</Text>);
