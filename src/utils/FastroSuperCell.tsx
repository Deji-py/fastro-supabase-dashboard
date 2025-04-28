import React from "react";
import { Text } from "@mantine/core";
import {
  AvatarCell,
  BadgeCell,
  BooleanCell,
  ColorCell,
  CurrencyCell,
  CustomCell,
  DateCell,
  EmailCell,
  EmailListCell,
  EmptyCell,
  FlagCell,
  IconCell,
  ImageCell,
  LocationCell,
  PercentageCell,
  PhoneCell,
  ProgressCell,
  RatingCell,
  RichEditorCell,
  RoleCell,
  SentimentCell,
  StatusCell,
  TagCell,
  UsernameCell,
  VerifiedCell,
} from "./_cell_components";

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
  | "rich-editor"
  | "color"
  | "sentiment"
  | "email-list";

type FastroSuperCellProps = {
  variant: CellVariants;
  value: any;
  options?: any;
};

function FastroSuperCellComponent({
  variant,
  value,
  options,
}: FastroSuperCellProps) {
  if (value === null || value === undefined) {
    return <Text c="dimmed">—</Text>;
  }

  switch (variant) {
    case "avatar":
      return <AvatarCell value={value} />;

    case "badge":
      return <BadgeCell value={value} />;

    case "progress":
      return <ProgressCell value={value} />;

    case "status":
      return <StatusCell value={value} options={options} />;

    case "sentiment":
      return <SentimentCell value={value} />;

    case "icon":
      return <IconCell value={value} />;

    case "date":
      return <DateCell value={value} />;

    case "rating":
      return <RatingCell value={value} />;

    case "flag":
      return <FlagCell value={value} />;

    case "verified":
      return <VerifiedCell />;

    case "currency":
      return <CurrencyCell value={value} />;

    case "percentage":
      return <PercentageCell value={value} />;

    case "email":
      return <EmailCell value={value} />;

    case "phone":
      return <PhoneCell value={value} />;

    case "username":
      return <UsernameCell value={value} />;

    case "image":
      return <ImageCell value={value} />;

    case "tag":
      return <TagCell value={value} />;

    case "boolean":
      return <BooleanCell value={value} />;

    case "role":
      return <RoleCell value={value} />;

    case "location":
      return <LocationCell value={value} />;

    case "color":
      return <ColorCell value={value} />;

    case "rich-editor":
      return <RichEditorCell value={value} />;

    case "email-list":
      return <EmailListCell value={value} />;

    case "custom":
      return <CustomCell value={value} />;

    default:
      return <CustomCell value={value} />;
  }
}

const FastroSuperCell = React.memo(FastroSuperCellComponent);

export default FastroSuperCell;
