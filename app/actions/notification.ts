import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    doc,
    updateDoc,
    deleteDoc,
  } from "firebase/firestore";
  import { db } from "@/app/db";
  import { IMGBB } from "@/app/helpers/imgbb";
  
  type Notification = {
    android_channel_id: string;
    body: string;
    image: IMGBB | null;
    link: string;
    title: string;
    time: number; // Timestamp
  };

  
  // CREATE: Add a new notification
  export async function createNotification(notification: Notification): Promise<string> {
    try {
      const notificationsCollection = collection(db, "notifications");
      const docRef = await addDoc(notificationsCollection, {
        ...notification,
        createdAt: Date.now(),
      });
      console.log("Notification created with ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }
  
  // READ: Get all notifications
  export async function getAllNotifications(): Promise<Notification[]> {
    try {
      const notificationsCollection = collection(db, "notifications");
      const snapshot = await getDocs(notificationsCollection);
      const notifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  }
  
  // READ: Get a notification by ID
  export async function getNotificationById(notificationId: string): Promise<Notification | null> {
    try {
      const notificationDocRef = doc(db, "notifications", notificationId);
      const notificationDocSnap = await getDoc(notificationDocRef);
      if (notificationDocSnap.exists()) {
        return { id: notificationDocSnap.id, ...notificationDocSnap.data() } as Notification;
      } else {
        console.log("No such notification!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching notification by ID:", error);
      throw error;
    }
  }
  
  // UPDATE: Update an existing notification
  export async function updateNotification(
    notificationId: string,
    updatedData: Partial<Notification>
  ): Promise<void> {
    try {
      const notificationDocRef = doc(db, "notifications", notificationId);
      await updateDoc(notificationDocRef, {
        ...updatedData,
        updatedAt: Date.now(),
      });
      console.log("Notification updated successfully!");
    } catch (error) {
      console.error("Error updating notification:", error);
      throw error;
    }
  }
  
  // DELETE: Delete a notification
  export async function deleteNotification(notificationId: string): Promise<void> {
    try {
      const notificationDocRef = doc(db, "notifications", notificationId);
      await deleteDoc(notificationDocRef);
      console.log("Notification deleted successfully!");
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }
  