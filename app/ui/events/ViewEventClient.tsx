"use client";
import BaseCard from "../base_card";
import { Event } from "@/app/actions/events";
import { deleteEvent } from "@/app/actions/events";
export type EventMap = {
  [category: string]: {
    [eventName: string]: Event;
  };
};

export type Coordinator = {
  name: string;
  contact: string;
};



export default function ViewEventClient({
  events,
 
}: {
  events: EventMap;
  
}) {

  
  const handleDelete = async (name: string, category: string) => {
    try {
      await deleteEvent(name, category); // Perform the delete operation
      console.log(`${name} from ${category} deleted`)
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Error deleting the event. Please try again.");
    }
  };
  return (
    <div className="flex flex-wrap justify-center items-center">
      {Object.entries(events).map(([category, categoryEvents]) =>
        Object.entries(categoryEvents).map(([eventName, event]) => {
          const dataArray: { label: string; value: string; isUrl?: boolean }[] = [
            { label: "Name", value: event.eventName },
            { label: "Category", value: event.eventCategory },
            { label: "Poster", value: event.poster as string, isUrl: true }
          ];

         

          return (
            <div key={`${category}-${eventName}`} className="m-4">
              <BaseCard
                data={dataArray}
                title={event.eventName}
                image={event.poster || null}
                toEdit={`/events/${category}/${event.eventName}`} // Edit URL
                onDelete={() => handleDelete(event.eventName, category)} // Trigger delete
              />
            </div>
          );
        })
      )}
    </div>
  );
}
