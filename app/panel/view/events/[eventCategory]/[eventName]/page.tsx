import UpdateEventForm from "@/app/ui/events/UpdateEventForm";

type EventParams = Promise<{ eventCategory: string; eventName: string }>;

export default async function EventPage({ params }: { params: EventParams }) {
  const { eventCategory, eventName } = await params;
  const formattedEventName = eventName.replace("-", " ");

  return (
    <div className="bg-gray-900 p-4 shadow-md rounded-md overflow-clip">
      <h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
        Update Event
      </h1>
      <h3 className="text-2xl py-2 font-bold font-mono">Update Your Event</h3>
      <UpdateEventForm
        eventCategory={eventCategory}
        eventName={formattedEventName}
      />
    </div>
  );
}
