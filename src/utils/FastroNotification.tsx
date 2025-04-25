import { notifications } from "@mantine/notifications";
import { IconX, IconCheck, IconInfoCircle } from "@tabler/icons-react";
import { ReactNode } from "react";

type NotificationType = "error" | "success" | "info" | "action";

interface FastroNotificationProps {
  type?: NotificationType;
  title?: string;
  message?: string;
  autoClose?: number;
  id?: string;
}

export function FastroNotification({
  type = "info",
  title,
  message,
  autoClose = 4000,
  id = `fastro-${Date.now()}`,
}: FastroNotificationProps): void {
  let icon: ReactNode,
    color: string,
    backgroundColor: string,
    textColor: string;

  // Set icon, color, background, and text color based on notification type
  switch (type) {
    case "error":
      icon = <IconX size={20} />;
      color = "red";
      backgroundColor = "#F8D7DA"; // Light red background
      textColor = "#721C24"; // Dark red text
      break;
    case "success":
      icon = <IconCheck size={20} />;
      color = "green";
      backgroundColor = "#D4EDDA"; // Light green background
      textColor = "#155724"; // Dark green text
      break;
    case "info":
      icon = <IconInfoCircle size={20} />;
      color = "blue";
      backgroundColor = "#D1ECF1"; // Light blue background
      textColor = "#0C5460"; // Dark blue text
      break;
    case "action":
      icon = <IconInfoCircle size={20} />;
      color = "orange";
      backgroundColor = "#FFF3CD"; // Light yellow background
      textColor = "#856404"; // Dark yellow text
      break;
    default:
      icon = <IconInfoCircle size={20} />;
      color = "gray";
      backgroundColor = "#E2E3E5"; // Light gray background
      textColor = "#383D41"; // Dark gray text
  }

  // Show the notification using Mantine's API with updated styles
  notifications.show({
    id,
    position: "top-center", // Center the notification
    withCloseButton: true,
    autoClose,
    title: (
      <div style={{ fontWeight: 600, fontSize: 14, color: textColor }}>
        {title || type.toUpperCase()}
      </div>
    ),
    message: (
      <div style={{ fontSize: 12, color: textColor }}>{message || ""}</div>
    ),
    color, // Use Mantine's color utility for the icon
    icon,
    loading: false,
    withBorder: true, // Border for the notification
    style: {
      backgroundColor, // Use custom background color
      border: `1px solid ${textColor}20`, // Light border matching text color
      borderRadius: "8px", // Rounded corners
      padding: "12px 18px", // More spacious padding
      boxShadow: "none", // Subtle shadow for depth
      maxWidth: 400, // Limit width for better presentation
      width: "100%", // Ensure responsiveness
      transition: "all 0.3s ease-in-out", // Smooth animation for notification appearance
    },
  });
}
