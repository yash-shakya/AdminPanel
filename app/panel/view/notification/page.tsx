"use client";
import NotificationTable from "@/app/ui/notification/NotificationTable";

export default function Home() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <NotificationTable />
    </div>
  );
}
