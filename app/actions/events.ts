import {
	collection,
	addDoc,
	getDocs,
	getDoc,
	doc,
	updateDoc,
	deleteDoc,
} from "firebase/firestore";
import { db } from "@/app/db";
import { IMGBB } from "@/app/helpers/imgbb";

type Event = {
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
};

type Coordinator = {
	coordinator_name: string;
	coordinator_number: string;
};

export async function createEvent(event: Event): Promise<string> {
	try {
		const eventsCollection = collection(db, "events");
		const docRef = await addDoc(eventsCollection, {
			...event,
		});
		console.log("Event created with ID:", docRef.id);
		return docRef.id;
	} catch (error) {
		console.error("Error creating event:", error);
		throw error;
	}
}

export async function getAllEvents(): Promise<Event[]> {
	try {
		const eventsCollection = collection(db, "events");
		const snapshot = await getDocs(eventsCollection);
		const events = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		return events;
	} catch (error) {
		console.error("Error fetching events:", error);
		throw error;
	}
}

// READ: Get an event by ID
export async function getEventById(eventId: string): Promise<Event | null> {
	try {
		const eventDocRef = doc(db, "events", eventId);
		const eventDocSnap = await getDoc(eventDocRef);
		if (eventDocSnap.exists()) {
			return { id: eventDocSnap.id, ...eventDocSnap.data() } as Event;
		} else {
			console.log("No such event!");
			return null;
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
