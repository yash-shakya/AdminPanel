import { database, ref, set, get, update, remove, query, orderByChild, equalTo } from "@/app/db"; // Ensure `db` is initialized for Realtime Database
import createImgbbUrl from "@/app/helpers/imgbb";

export type Event = {
  coordinators: Coordinator[];
  description: string;
  document: string;
  endTime: number;
  eventCategory: string;
  eventName: string;
  flagship: boolean;
  poster?: string;
  rules: string[];
  startTime: number;
  venue: string;
};

type EventMap = {
  [category: string]: {
    events: {[eventName: string]: Event};
    icon: string;
    imgUrl: string;
    index: number;
  };
};

type eventData = Event & {
  image: File;
};

export type Coordinator = {
  coordinator_name: string;
  coordinator_number: string;
};

export async function createEvent(eventData: eventData): Promise<string> {
  try {
    const { image, ...event } = eventData;
    if (!image) {
      throw new Error("No image provided");
    }
    const imageUrl = await createImgbbUrl(image);
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const uniqueDocId = `${event.eventName}-${randomSuffix}`;
    const { eventName, startTime, endTime } = event;
    const startTimeNumber = new Date(startTime).getTime();
    const endTimeNumber = new Date(endTime).getTime();

    const fullEventData = {
      ...event,
      poster: imageUrl?.url,
      startTime: startTimeNumber,
      endTime: endTimeNumber,
    };

    await set(ref(database, `events/${uniqueDocId}`), fullEventData);

    return uniqueDocId;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function getAllEvents(): Promise<EventMap> {
  const eventMap: EventMap = {};
  try {
    const eventsRef = ref(database, "events");
    const snapshot = await get(eventsRef);

    if (snapshot.exists()) {
      return snapshot.val();
    }

    return {};
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw new Error("Failed to fetch all events");
  }
}

export async function deleteEvent(
  eventName: string,
  eventCategory: string,
): Promise<void> {
  try {
    const eventsRef = ref(database, "events");
    const eventQuery = query(
      eventsRef,
      orderByChild("eventCategory"),
      equalTo(eventCategory),
    );
    const snapshot = await get(eventQuery);

    if (!snapshot.exists()) {
      console.error(
        `Event '${eventName}' not found in category '${eventCategory}'.`,
      );
      throw new Error("Event does not exist.");
    }

    let eventKey: string | null = null;

    snapshot.forEach((childSnapshot) => {
      const event = childSnapshot.val() as Event;
      if (event.eventName === eventName) {
        eventKey = childSnapshot.key;
      }
    });

    if (eventKey) {
      await remove(ref(database, `events/${eventKey}`));
    } else {
      throw new Error("Event not found.");
    }
  } catch (error) {
    console.error(
      `Failed to delete event '${eventName}' in category '${eventCategory}':`,
      error,
    );
    throw new Error("Failed to delete event");
  }
}

export async function updateEventByName(
  eventCategory: string,
  eventName: string,
  updatedData: any,
): Promise<void> {
  try {
    const eventsRef = ref(database, `events/${eventCategory}/events/${eventName}`);
    const eventDescriptionRef = ref(database,`eventDescription/${eventCategory}/${eventName}`);

    const eventsSnapshot = await get(eventsRef);
    
    if (!eventsSnapshot.exists()) {
      throw new Error(
        `Event '${eventName}' in category '${eventCategory}' does not exist.`,
      );
    }
    
    const eventDescriptionSnapshot = await get(eventDescriptionRef);
    let eventKey: string | null = null;
    let poster: string | undefined;
    console.log("youuo",updatedData);
    if (updatedData.image) {
      const imageUrl = await createImgbbUrl(updatedData.image);
      poster = imageUrl?.url as string;
      updatedData.poster = poster;
    }

    console.log("=====",updatedData);
    const {endTime,startTime} = updatedData;
    delete updatedData.image;

    await update(eventDescriptionRef, updatedData);
    const updatedEventData2 = {
      endTime, startTime, eventName
    }
    await update(eventsRef,updatedEventData2);
  } catch (error) {
    console.error(
      `Failed to update event '${eventName}' in category '${eventCategory}':`,
      error,
    );
    throw new Error("Failed to update event");
  }
}

export async function getEventByName(
  eventCategory: string,
  eventName: string,
): Promise<Event | null> {
  try {
    const eventRef = ref(database, `eventDescription/${eventCategory}/${eventName}`);
    const snapshot = await get(eventRef);

    if (!snapshot.exists()) {
      console.error(
        `Event '${eventName}' in category '${eventCategory}' does not exist.`
      );
      return null;
    }

    return snapshot.val() as Event;
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Failed to fetch event");
  }
}
