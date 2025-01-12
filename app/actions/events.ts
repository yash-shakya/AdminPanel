import {
	collection,
	addDoc,
	getDocs,
	getDoc,
	setDoc,
	doc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import { db } from "@/app/db";
import { IMGBB } from "@/app/helpers/imgbb";
import crypto from "crypto";



function generateEventId(name: string, date: string, time: string): string {
    return crypto
        .createHash("sha256")
        .update(name + date + time)
        .digest("hex")
        .slice(0, 20); 
}



export type Event = {
    id?: string; // Add this
    coordinators: Coordinator[];
    description: string;
    document: string;
    endTime: string;
    eventCategory: string;
    eventName: string;
    flagship: boolean;
    poster: IMGBB | null;
    rules: string[];
    startTime: string;
    venue: string;
	icon : IMGBB | null;
	imgUrl : IMGBB | null;
};


export type Coordinator = {
	coordinator_name: string;
	coordinator_number: string;
};

type CategoryMetaDataInput = {
	[category: string]: { icon: string; imgUrl: string };
  };



export async function createEvent(event: Event): Promise<string> {
    try {
        // Generate a unique ID for the event
        const eventId = generateEventId(event.eventName, event.startTime, event.endTime);

        // Reference Firestore document using the generated ID
        const eventDocRef = doc(db, "events", eventId);

        // Set the document in Firestore
        await setDoc(eventDocRef, { ...event, id: eventId, createdAt: Date.now() });

        console.log("Event created with ID:", eventId);
        return eventId;
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


  
export async function getAllEvents(): Promise<{
	[category: string]: {
	  events: { [eventName: string]: Pick<Event, "eventName" | "startTime" | "endTime"> };
	  icon: string | null;
	  imgUrl: string | null;
	  index: number;
	};
  }> {
	try {
	  const eventsCollection = collection(db, "events");
	  const snapshot = await getDocs(eventsCollection);
  
	  const categorizedEvents: {
		[category: string]: {
		  events: { [eventName: string]: Pick<Event, "eventName" | "startTime" | "endTime"> };
		  icon: string | null;
		  imgUrl: string | null;
		  index: number;
		};
	  } = {};
  
	  let currentIndex = 1; 
  
	  snapshot.docs.forEach((doc) => {
		const event = doc.data() as Event;
		const category = event.eventCategory || "Uncategorized";
  
		// Initialize category in the result object if not already done
		if (!categorizedEvents[category]) {
		  categorizedEvents[category] = {
			events: {},
			icon: event.icon?.url || null, // Use `icon` from the event
			imgUrl: event.imgUrl?.url || null, // Use `imgUrl` from the event
			index: currentIndex++, // Assign and increment the index
		  };
		}
  
		// Add event data under its category
		categorizedEvents[category].events[event.eventName] = {
		  eventName: event.eventName,
		  startTime: event.startTime,
		  endTime: event.endTime,
		};
	  });
  
	  return categorizedEvents;
	} catch (error) {
	  console.error("Error fetching events:", error);
	  throw error;
	}
  }
  
  
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

  export async function getAllEventsDescription(): Promise<
  Record<string, Record<string, Event>>
> {
  try {
    const eventsCollection = collection(db, "events");
    const snapshot = await getDocs(eventsCollection);

    // Categorized format: grouped by eventCategory and eventName
    const categorizedFormat: Record<string, Record<string, Event>> = {};

    snapshot.docs.forEach((doc) => {
      const event = doc.data() as Event;
      const category = event.eventCategory || "Uncategorized";
      const eventName = event.eventName;

      if (!categorizedFormat[category]) {
        categorizedFormat[category] = {};
      }

      categorizedFormat[category][eventName] = {
        id: doc.id,
        ...event,
      };
    });

    return categorizedFormat;
  } catch (error) {
    console.error("Error fetching events descriptions:", error);
    throw error;
  }
}

export async function getEventById(eventId: string): Promise<Event | null> {
	try {
		const eventDocRef = doc(db, "events", eventId);
		const eventDocSnap = await getDoc(eventDocRef);
		if (eventDocSnap.exists()) {
			return { id: eventDocSnap.id, ...eventDocSnap.data() as Event } as Event;
		} else {
			console.log("No such event!");
			throw new Error(`Event with ID ${eventId} not found.`);
			
		}
	} catch (error) {
		console.error("Error fetching event by ID:", error);
		throw error;
	}
}



export async function updateEvent(
	eventId: string,
	updatedData: Partial<Event>
): Promise<void> {
	try {
		const eventDocRef = doc(db, "events", eventId);
		await updateDoc(eventDocRef, {
			...updatedData,
			updatedAt: Date.now(),
		});
		console.log("Event updated successfully!");
	} catch (error) {
		console.error("Error updating event:", error);
		throw error;
	}
}

export async function deleteEvent(eventId: string): Promise<void> {
	try {
		const eventDocRef = doc(db, "events", eventId);
		await deleteDoc(eventDocRef);
		console.log("Event deleted successfully!");
	} catch (error) {
		console.error("Error deleting event:", error);
		throw error;
	}
}
