"use client";
import { supabaseClient } from "@/services/supabase/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export interface Activity {
  id: number;
  activity_name: string;
  details: string;
  seen: boolean;
  timestamp: string;
  user: string;
  type: string;
}

interface NotificationGroup {
  type: string;
  count: number;
  activities: Activity[];
}

interface NotificationState {
  totalUnseen: number;
  groups: NotificationGroup[];
  latestActivity?: Activity;
}

interface NotificationContextProps {
  notifications: NotificationState;
  markAsRead: (activityId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationState>({
    totalUnseen: 0,
    groups: [],
  });

  const fetchNotifications = async () => {
    const { data: activities, error } = await supabaseClient
      .from("activities")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching activities:", error);
      return;
    }

    updateNotificationState(activities || []);
  };

  const updateNotificationState = (activities: Activity[]) => {
    // Group activities by type
    const groupedActivities = activities.reduce((acc, activity) => {
      const type = activity.type || "other";
      if (!acc[type]) {
        acc[type] = {
          type,
          count: 0,
          activities: [],
        };
      }

      if (!activity.seen) {
        acc[type].count++;
      }

      acc[type].activities.push(activity);
      return acc;
    }, {} as Record<string, NotificationGroup>);

    const groups = Object.values(groupedActivities);
    const totalUnseen = groups.reduce((sum, group) => sum + group.count, 0);
    const latestActivity = activities[0];

    setNotifications({
      totalUnseen,
      groups,
      latestActivity,
    });
  };

  const markAsRead = async (activityId: number) => {
    const { error } = await supabaseClient
      .from("activities")
      .update({ seen: true })
      .eq("id", activityId);

    if (error) {
      console.error("Error marking activity as read:", error);
      return;
    }

    // Refresh notifications
    await fetchNotifications();
  };

  const markAllAsRead = async () => {
    const { error } = await supabaseClient
      .from("activities")
      .update({ seen: true })
      .eq("seen", false);

    if (error) {
      console.error("Error marking all activities as read:", error);
      return;
    }

    // Refresh notifications
    await fetchNotifications();
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Subscribe to real-time updates
    const channel = supabaseClient
      .channel("activities-channel")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "activities",
        },
        async (payload) => {
          // Refresh the entire notification state when any change occurs
          await fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(channel);
    };
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notifications, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextProps => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
