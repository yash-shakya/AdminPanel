import { useState, useEffect } from "react";
import BaseCard from "../base_card";
import {
  NotificationsDTO,
  Notification,
  getAllNotifications,
  deleteNotification,
} from "@/app/actions/notification";

interface NotificationTableProps {
  onDelete?: (id: string) => void;
}

export default function NotificationTable({
  onDelete,
}: NotificationTableProps) {
  const [notifications, setNotifications] = useState<NotificationsDTO>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getAllNotifications();
      setNotifications(data);
    } catch (err) {
      setError("Failed to load notifications");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      const updatedNotifications = { ...notifications };
      delete updatedNotifications[id];
      setNotifications(updatedNotifications);
      onDelete?.(id);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg font-semibold text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {Object.entries(notifications).map(([id, notification]) => {
        const cardData = [
          {
            label: "Channel",
            value: notification.android_channel_id,
          },
          {
            label: "Message",
            value:
              notification.body.length > 50
                ? `${notification.body.substring(0, 50)}...`
                : notification.body,
          },
          {
            label: "Link",
            value: notification.link,
            isURL: true,
          },
          {
            label: "Time",
            value: new Date(notification.time).toLocaleString(),
          },
        ];

        return (
          <BaseCard
            key={id}
            image={notification.image}
            title={notification.title}
            data={cardData}
            toEdit={`/panel/view/notification/${id}`}
            onDelete={() => handleDelete(id)}
          />
        );
      })}
    </div>
  );
}
