"use client";
import { useEffect, useState } from "react";
import { getAllEvents, deleteEvent, Event } from "@/app/actions/events";
import ViewEventClientPage from "./ViewEventClient";

export type EventMap = {
  [category: string]: {
    [eventName: string]: Event;
  };
};

export default function ViewEvents() {
  const [eventCategories, setEventCategories] = useState<EventMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents: EventMap = await getAllEvents(); // Adjusted to handle the nested structure
        console.log(fetchedEvents);
        setEventCategories(fetchedEvents);
      } catch (err) {
        setError("Failed to fetch events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading events...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  return <ViewEventClientPage events={eventCategories} />;
}
