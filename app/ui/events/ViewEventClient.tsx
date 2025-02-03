"use client";
import BaseCard from "../base_card";
import { Event } from "@/app/actions/events";
import { deleteEvent } from "@/app/actions/events";
import { useRouter } from "next/navigation";
export type EventMap = {
  [category: string]: {
    events:{ [eventName: string]: {endTime: number, startTime: number, eventName: string}};
    icon: string;
    imgUrl: string;
    index: number;
  };
};

export type Coordinator = {
  name: string;
  contact: string;
};

export default function ViewEventClient({ events }: { events: EventMap }) {
  const router = useRouter();

  const handleDelete = async (name: string, category: string) => {
    try {
      await deleteEvent(name, category);
      console.log(`${name} from ${category} deleted`);
      router.refresh();
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Error deleting the event. Please try again.");
    }
  };
  console.log("HOLa",events);
  return (
    <div className="flex flex-wrap justify-center items-center">
      {Object.entries(events).map(([category, categoryEvents]) =>
        Object.entries(categoryEvents.events).map(([eventName, event]) => {
          const dataArray: { label: string; value: string; isUrl?: boolean }[] =
            [
              { label: "Name", value: event.eventName },
              { label: "EndTime", value: new Date(event.startTime).toLocaleDateString() },
              { label: "StartTime", value: new Date(event.endTime).toLocaleDateString() },
            ];

          return (
            <div key={`${category}-${eventName}`} className="m-4">
              <BaseCard
                data={dataArray}
                title={event.eventName}
                image={categoryEvents.imgUrl || null}
                toEdit={`events/${category}/${event.eventName}`} // Edit URL
                onDelete={() => handleDelete(event.eventName, category)} // Trigger delete
              />
            </div>
          );
        }),
      )}
    </div>
  );
}
