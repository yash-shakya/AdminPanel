"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BaseForm } from "@/app/ui/base_form";
import {
  getNotificationById,
  updateNotification,
} from "@/app/actions/notification";
import { Notification } from "@/app/actions/notification";

type FieldType =
  | "text"
  | "email"
  | "number"
  | "select"
  | "textarea"
  | "time"
  | "file"
  | "password"
  | "date"
  | "datetime-local"
  | "checkbox";

const EditNotificationPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const notificationData = await getNotificationById(id as string);
          setNotification(notificationData);
        } catch (error) {
          console.error("Error fetching notification:", error);
        }
      })();
    }
  }, [id]);

  const handleSubmit = async (updatedData: Partial<Notification>) => {
    if (!id) return;

    try {
      await updateNotification(id as string, updatedData);
      alert("Notification updated successfully!");
      router.push("/panel/view/notification");
    } catch (error) {
      console.error("Error updating notification:", error);
      alert("Failed to update notification.");
    }
  };

  if (!notification) {
    return <p>Loading...</p>;
  }

  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text" as FieldType,
      value: notification.title,
      required: true,
    },
    {
      name: "body",
      label: "Body",
      type: "textarea" as FieldType,
      value: notification.body,
      required: true,
    },
    {
      name: "android_channel_id",
      label: "Club/Society",
      type: "text" as FieldType,
      value: notification.android_channel_id,
      required: true,
    },
    {
      name: "link",
      label: "Link",
      type: "text" as FieldType,
      value: notification.link,
      required: true,
    },
    {
      name: "image",
      label: "Image",
      type: "file" as FieldType,
      value: notification.image,
      required: true,
    },
    {
      name: "time",
      label: "Time",
      type: "datetime-local" as FieldType,
      value: new Date(notification.time).toISOString().slice(0, 16),
      required: true,
    },
  ];

  return (
    <div>
      <h1>Edit Notification</h1>
      <BaseForm
        title="Edit Notification Details"
        fields={fields}
        submit={handleSubmit}
        submitText="Update"
      />
    </div>
  );
};

export default EditNotificationPage;
