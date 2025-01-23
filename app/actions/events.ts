import { collection,
  setDoc,
getDocs,
getDoc,
doc,
updateDoc,
deleteDoc,
deleteField, 
query,
where} from "firebase/firestore";
import { db } from "@/app/db";
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
    [eventName: string]: Event;
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
    const eventsDocRef = doc(db, "events", uniqueDocId);

    const fullEventData = {
      ...event,
      poster: imageUrl?.url,
      startTime: startTimeNumber,
      endTime: endTimeNumber,
    };

    await setDoc(eventsDocRef, fullEventData);
    
    return uniqueDocId;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

export async function getAllEvents(): Promise<EventMap> {
  const eventMap: EventMap = {};
  const eventsSnapshot = await getDocs(collection(db, "events"));

  eventsSnapshot.forEach((eventDoc) => {
    const eventData = eventDoc.data() as Event;
    const { eventCategory, eventName } = eventData;
    if (!eventMap[eventCategory]) {
      eventMap[eventCategory] = {};
    }

    eventMap[eventCategory][eventName] = {
      ...eventData,
    };
  });

  return eventMap;
}

export async function deleteEventCategory(id: string) {
  try {
    const categoryRef = doc(db, "events", id);
    await deleteDoc(categoryRef);
  } catch (error) {
    console.error("Error deleting event category:", error);
    throw new Error("Failed to delete event category");
  }
}



export async function deleteEvent(eventName: string, eventCategory: string): Promise<void> {
  try {
    // Construct the document path for the event
    const eventRef = doc(db, "eventDescription", eventCategory);
    
    // Check if the document exists
    const docSnap = await getDoc(eventRef);
    if (!docSnap.exists()) {
        console.error(`Event '${eventName}' not found in category '${eventCategory}'.`);
        throw new Error("Event does not exist.");
    }

    // Attempt to delete the event document
    await deleteDoc(eventRef);
} catch (error) {
    console.error(`Failed to delete event '${eventName}' in category '${eventCategory}':`, error);
    throw new Error("Failed to delete event");
}
}


export async function updateEventByName(
  eventCategory: string,
  eventName: string,
  updatedData: any
): Promise<void> {
  try {
    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef,
      where("eventCategory", "==", eventCategory),
      where("eventName", "==", eventName)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error(`Event '${eventName}' in category '${eventCategory}' does not exist.`);
    }

    const eventDoc = querySnapshot.docs[0];
    const eventRef = eventDoc.ref;

    let poster = eventDoc.data().poster;
    if (updatedData.image) {
      const imageUrl = await createImgbbUrl(updatedData.image);
      poster = imageUrl?.url;
    }

    const updatedEventData = {
      ...eventDoc.data(),
      ...updatedData,
      poster,
    };
    delete updatedEventData.image;

    await updateDoc(eventRef, updatedEventData);
  } catch (error) {
    console.error(`Failed to update event '${eventName}' in category '${eventCategory}':`, error);
    throw new Error("Failed to update event");
  }
}

export async function getEventByName(eventCategory: string, eventName: string): Promise<any | null> {
  try {
    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef,
      where("eventCategory", "==", eventCategory),
      where("eventName", "==", eventName)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    } else {
      console.error(`Event '${eventName}' in category '${eventCategory}' does not exist.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching event:", error);
    throw new Error("Failed to fetch event");
  }
}