import { collection,
  setDoc,
getDocs,
getDoc,
doc,
updateDoc,
deleteDoc,
deleteField } from "firebase/firestore";
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
    const { image, eventCategory, ...event } = eventData;

    // Ensure there is an image file
    if (!image) {
      throw new Error("No image provided");
    }

    // Upload image to an external service (e.g., Imgbb) and get the URL
    const imageUrl = await createImgbbUrl(image);

    // Add the image URL to the event data
    const poster = imageUrl?.url;

    // Prepare the event times
    const { eventName, startTime, endTime } = event;
    const startTimeNumber = new Date(startTime).getTime();
    const endTimeNumber = new Date(endTime).getTime();

    // Reference to the 'events' collection in Firestore
    const eventsDocRef = doc(db, "events", eventCategory);

    // Add or update event details in the 'events' collection
    await setDoc(eventsDocRef, {
      [`events.${eventName}`]: {
        eventName,
        startTime: startTimeNumber,
        endTime: endTimeNumber,
      },
      startTime: startTimeNumber,
      endTime: endTimeNumber,
    });

    // Reference to the 'eventDescription' collection
    const eventDescriptionDocRef = doc(db, "eventDescription", eventCategory);

    // Add event data to the 'eventDescription' collection
    await setDoc(eventDescriptionDocRef, {
      [eventName]: {
        ...event,
        poster,
        eventName, // Include the event name
      },
    });

    console.log("Event created successfully");
    return "DONE";
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
}
// export async function getAllEvents() {
//   try {
//     const eventsCollectionRef = collection(db, "events");
//     const querySnapshot = await getDocs(eventsCollectionRef);

//     // Map over all documents in the collection
//     const events = querySnapshot.docs.map((doc) => ({
//       id: doc.id, // Document ID
//       ...doc.data(), // All document data
//     }));

//     return events;
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     throw new Error("Failed to fetch events");
//   }
// }

export async function getAllEvents(): Promise<EventMap> {
  
  const eventMap: EventMap = {};

  // Fetch all categories (top-level documents)
  const categoriesSnapshot = await getDocs(collection(db, "eventDescription"));

  categoriesSnapshot.forEach((categoryDoc) => {
    const categoryName = categoryDoc.id; // e.g., "Astronomy", "Informals"
    const events = categoryDoc.data(); // Nested structure like { Hackshtra: {...}, Event2: {...} }

    eventMap[categoryName] = {};

    // Process each event in the category
    Object.entries(events).forEach(([eventName, eventData]) => {
      eventMap[categoryName][eventName] = eventData as Event;
    });
  });

  return eventMap;
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



export async function deleteEventCategory(id: string) {
  try {
    const categoryRef = doc(db, "events", id);
    await deleteDoc(categoryRef);
    console.log(`Event category '${id}' deleted successfully`);
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

    console.log(`Successfully deleted event '${eventName}' in category '${eventCategory}'.`);
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
    const categoryRef = doc(db, "eventDescription", eventCategory);

    // Fetch the existing event data
    const categorySnap = await getDoc(categoryRef);
    if (!categorySnap.exists()) {
      throw new Error(`Category '${eventCategory}' does not exist.`);
    }

    const events = categorySnap.data();
    const existingEvent = events[eventName];
    if (!existingEvent) {
      throw new Error(`Event '${eventName}' does not exist in category '${eventCategory}'.`);
    }

    // Handle image upload if a new image is provided
    let poster = existingEvent.poster; // Default to existing poster
    if (updatedData.image) {
      const imageUrl = await createImgbbUrl(updatedData.image); // Upload new image
      poster = imageUrl?.url; // Update poster with new URL
    }

    // Prepare updated event data
    const updatedEventData = {
      ...existingEvent, // Keep existing data
      ...updatedData, // Overwrite with updated fields
      poster, // Update poster URL
    };

    // Remove 'image' field from updatedData (if it exists)
    delete updatedEventData.image;

    // Update Firestore document with the updated event data
    await updateDoc(categoryRef, {
      [eventName]: updatedEventData,
    });

    console.log(`Successfully updated event '${eventName}' in category '${eventCategory}'.`);
  } catch (error) {
    console.error(`Failed to update event '${eventName}' in category '${eventCategory}':`, error);
    throw new Error("Failed to update event");
  }
}

export async function getEventByName(eventCategory: string, eventName: string): Promise<any | null> {
  try {
      // Reference the document for the category
      const categoryRef = doc(db, "eventDescription", eventCategory);
      const categorySnap = await getDoc(categoryRef);

      if (categorySnap.exists()) {
          const events = categorySnap.data(); // JSON object containing all events in the category
          return events[eventName] || null; // Return the specific event or null if not found
      } else {
          console.error(`Category '${eventCategory}' does not exist.`);
          return null;
      }
  } catch (error) {
      console.error("Error fetching event:", error);
      throw new Error("Failed to fetch event");
  }
}