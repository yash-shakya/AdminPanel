import { database, ref, set, get, update, remove, child } from "@/app/db";
import createImgbbUrl, { IMGBB } from "@/app/helpers/imgbb";

export type Notification = {
  android_channel_id: string;
  body: string;
  image: string;
  link: string;
  title: string;
  time: number;
};

export type NotificationInput = Omit<Notification, "image"> & {
  imageFile: File;
};

export type NotificationsDTO = {
  [key: string]: Notification;
};

// Fetch all notifications
export async function getAllNotifications(): Promise<NotificationsDTO> {
  try {
    const dbRef = ref(database, "notifications");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val() as NotificationsDTO;
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error fetching notifications: ", error);
    throw new Error("Failed to fetch notifications");
  }
}

// Fetch a single notification by ID
export async function getNotificationById(id: string): Promise<Notification> {
  try {
    const dbRef = ref(database, `notifications/${id}`);
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      return snapshot.val() as Notification;
    } else {
      throw new Error("Notification not found");
    }
  } catch (error) {
    console.error("Error fetching notification: ", error);
    throw new Error("Failed to fetch notification");
  }
}

// Create a new notification
export async function createNotification(
  notificationInput: NotificationInput,
): Promise<string> {
  try {
    console.log("Creating notification with:", notificationInput);
    const randomId = Math.floor(Math.random() * 1_000_000_000).toString();
    const imageResult = await createImgbbUrl(notificationInput.imageFile);
    if (!imageResult?.url) {
      throw new Error("Image upload failed");
    }

    const notificationData: Notification = {
      android_channel_id: notificationInput.android_channel_id,
      body: notificationInput.body,
      image: imageResult.url,
      link: notificationInput.link,
      title: notificationInput.title,
      time: notificationInput.time,
    };

    const notificationRef = ref(database, `notifications/${randomId}`);
    await set(notificationRef, notificationData);

    console.log("Notification created successfully:", randomId);
    return randomId;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Failed to create notification");
  }
}

// Update an existing notification
export async function updateNotification(
  id: string,
  updatedData: Partial<Notification>,
): Promise<boolean> {
  try {
    const notificationRef = ref(database, `notifications/${id}`);
    if (updatedData.image) {
      const imgbb: IMGBB | null = await createImgbbUrl(updatedData.image);
      delete updatedData.image;
      if (imgbb) updatedData.image = imgbb.url as string;
    }

    await update(notificationRef, {
      ...updatedData,
      updatedAt: Date.now(),
    });

    console.log("Notification updated successfully!");
    return true;
  } catch (error) {
    console.error("Error updating notification:", error);
    return false;
  }
}

// Delete a notification
export async function deleteNotification(id: string): Promise<void> {
  try {
    const notificationRef = ref(database, `notifications/${id}`);
    await remove(notificationRef);
    console.log("Notification deleted successfully");
  } catch (error) {
    console.error("Error deleting notification: ", error);
    throw new Error("Failed to delete notification");
  }
}
