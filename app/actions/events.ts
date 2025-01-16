import { doc, updateDoc } from "firebase/firestore";
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

type eventData = Event & {
  image: File;
};

type Coordinator = {
  coordinator_name: string;
  coordinator_number: string;
};

export async function createEvent(eventData: eventData): Promise<string> {
  try {
    // Destructure the eventData
    const { image, eventCategory, ...event } = eventData;
    if (!image) {
      throw new Error("No image given");
    }
    // Upload the image and get the URL
    const imageUrl = await createImgbbUrl(image);

    // Add the generated poster URL to the event
    const poster = imageUrl?.url;

    // Extract EventTimes properties for the `events` collection
    const { eventName, startTime, endTime } = event;

    // Reference to the `events` collection
    const eventsDocRef = doc(db, "events", eventCategory);
    const startTimeNumber = new Date(startTime).getTime();
    const endTimeNumber = new Date(endTime).getTime();
    // Add or update EventTimes in the `events` collection
    await updateDoc(eventsDocRef, {
      [`events.${eventName}`]: { eventName, startTime, endTime },
      startTime: startTimeNumber,
      endTime: endTimeNumber,
    });

    // Reference to the `eventDescription` collection
    const eventDescriptionDocRef = doc(db, "eventDescription", eventCategory);

    // Add event data to the `eventDescription` collection
    await updateDoc(eventDescriptionDocRef, {
      [eventName]: {
        ...event,
        poster,
        eventName, // Include `eventName` as required in `eventDescription`
      },
    });

    console.log("Event created successfully");
    return "DONE";
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}

// export async function getAllEvents(): Promise<Event[]> {
// 	try {
// 		const eventsCollection = collection(db, "events");
// 		const snapshot = await getDocs(eventsCollection);
// 		const events: Event[] = snapshot.docs.map((doc) => ({
// 			id: doc.id,
// 			...(doc.data() as Event),
// 		}));
// 		return events;
// 	} catch (error) {
// 		console.error("Error fetching events:", error);
// 		throw error;
// 	}
// }

// export async function getAllEvents(): Promise<{
//   [category: string]: {
//     events: {
//       [eventName: string]: Pick<Event, "eventName" | "startTime" | "endTime">;
//     };
//     category_img: IMGBB | null;
//     index: number;
//   };
// }> {
//   try {
//     const eventsCollection = collection(db, "events");
//     const snapshot = await getDocs(eventsCollection);

//     const categorizedEvents: {
//       [category: string]: {
//         events: {
//           [eventName: string]: Pick<
//             Event,
//             "eventName" | "startTime" | "endTime"
//           >;
//         };
//         category_img: IMGBB | null;
//         index: number;
//       };
//     } = {};

//     let currentIndex = 1;

//     snapshot.docs.forEach((doc) => {
//       const event = doc.data() as Event;
//       const category = event.eventCategory || "Uncategorized";

//       if (!categorizedEvents[category]) {
//         categorizedEvents[category] = {
//           events: {},
//           category_img: event.category_img || null,
//           index: currentIndex++,
//         };
//       }

//       categorizedEvents[category].events[event.eventName] = {
//         eventName: event.eventName,
//         startTime: event.startTime,
//         endTime: event.endTime,
//       };
//     });

//     return categorizedEvents;
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     throw error;
//   }
// }

// export async function getAllEvents(): Promise<{ [category: string]: { [eventName: string]: Event } }> {
// 	try {
// 	  const eventsCollection = collection(db, "events");
// 	  const snapshot = await getDocs(eventsCollection);

// 	  // Create a structure to hold events categorized by eventCategory
// 	  const eventsByCategory: { [category: string]: { [eventName: string]: Event } } = {};

// 	  snapshot.docs.forEach(doc => {
// 		const eventData = doc.data() as Event;
// 		const eventCategory = eventData.eventCategory;

// 		// If the eventCategory doesn't exist yet, initialize it
// 		if (!eventsByCategory[eventCategory]) {
// 		  eventsByCategory[eventCategory] = {};
// 		}

// 		// Add the event to the appropriate category, keyed by eventName
// 		eventsByCategory[eventCategory][eventData.eventName] = {
// 		  id: doc.id,
// 		  ...eventData, // Spread other event data
// 		};
// 	  });

// 	  return eventsByCategory;
// 	} catch (error) {
// 	  console.error("Error fetching events:", error);
// 	  throw error;
// 	}
//   }

// export async function getAllEventsDescription(): Promise<
//   Record<string, Record<string, Event>>
// > {
//   try {
//     const eventsCollection = collection(db, "events");
//     const snapshot = await getDocs(eventsCollection);

//     // Categorized format: grouped by eventCategory and eventName
//     const categorizedFormat: Record<string, Record<string, Event>> = {};

//     snapshot.docs.forEach((doc) => {
//       const event = doc.data() as Event;
//       const category = event.eventCategory || "Uncategorized";
//       const eventName = event.eventName;

//       if (!categorizedFormat[category]) {
//         categorizedFormat[category] = {};
//       }

//       categorizedFormat[category][eventName] = {
//         id: doc.id,
//         ...event,
//       };
//     });

//     return categorizedFormat;
//   } catch (error) {
//     console.error("Error fetching events descriptions:", error);
//     throw error;
//   }
// }

// export async function getEventById(eventId: string): Promise<Event | null> {
//   try {
//     const eventDocRef = doc(db, "events", eventId);
//     const eventDocSnap = await getDoc(eventDocRef);
//     if (eventDocSnap.exists()) {
//       return {
//         id: eventDocSnap.id,
//         ...(eventDocSnap.data() as Event),
//       } as Event;
//     } else {
//       console.log("No such event!");
//       throw new Error(`Event with ID ${eventId} not found.`);
//     }
//   } catch (error) {
//     console.error("Error fetching event by ID:", error);
//     throw error;
//   }
// }

// export async function updateEvent(
//   eventId: string,
//   updatedData: Partial<Event>
// ): Promise<void> {
//   try {
//     const eventDocRef = doc(db, "events", eventId);
//     await updateDoc(eventDocRef, {
//       ...updatedData,
//       updatedAt: Date.now(),
//     });
//     console.log("Event updated successfully!");
//   } catch (error) {
//     console.error("Error updating event:", error);
//     throw error;
//   }
// }

// export async function deleteEvent(eventId: string): Promise<void> {
//   try {
//     const eventDocRef = doc(db, "events", eventId);
//     await deleteDoc(eventDocRef);
//     console.log("Event deleted successfully!");
//   } catch (error) {
//     console.error("Error deleting event:", error);
//     throw error;
//   }
// }
