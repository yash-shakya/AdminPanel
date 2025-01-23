"use client";

import { useEffect, useState } from "react";
import UpdateEventForm from "@/app/ui/events/UpdateEventForm";

export default function EventPage({ params }: { params: Promise<{ eventCategory: string; eventName: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ eventCategory: string; eventName: string } | null>(null);

  useEffect(() => {
    (async () => {
      const unwrappedParams = await params;
      const decodedEventCategory = decodeURIComponent(unwrappedParams.eventCategory);
      const decodedEventName = decodeURIComponent(unwrappedParams.eventName);
      setResolvedParams({
        eventCategory: decodedEventCategory,
        eventName: decodedEventName,
      });
    })();
  }, [params]);

  if (!resolvedParams) {
    return <p>Loading...</p>; 
  }

  const { eventCategory, eventName } = resolvedParams;

  return (
    <div>
      <h1 className="text-2xl font-bold">Update Event</h1>
      <UpdateEventForm eventCategory={eventCategory} eventName={eventName} />
    </div>
  );
}
