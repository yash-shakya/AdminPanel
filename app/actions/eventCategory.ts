import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../db";
import createImgbbUrl from "../helpers/imgbb";

interface EventCategoryData {
  eventCategory: string;
  image: File;
  index: number;
}

export async function createEventCategory(data: EventCategoryData) {
  const { eventCategory, image, index } = data;

  try {
    const categoryRef = doc(db, "events", eventCategory); // Reference to the category document
    const categorySnapshot = await getDoc(categoryRef);

    if (categorySnapshot.exists()) {
      throw new Error(
        `Event category '${eventCategory}' already exists in the database.`
      );
    }
    if (!image) {
      throw new Error("No image given");
    }
    const imageUrl = await createImgbbUrl(image);

    await setDoc(categoryRef, {
      icon: imageUrl?.thumb,
      imgUrl: imageUrl?.url,
      index,
      events: {}, // Initialize with an empty object for events
    });

    const descriptionRef = doc(db, "eventDescription", eventCategory); // Reference to the eventDescription document
    await setDoc(descriptionRef, {}); // Set the document with a null object

    console.log(`Event category '${eventCategory}' created successfully!`);
  } catch (error) {
    console.error("Error creating event category: ", error);
    throw new Error("Failed to create event category");
  }
}

export async function getAllEventCategory(): Promise<string[]> {
  const categories: string[] = [];

  try {
    // Reference to the "events" collection
    const eventsCollectionRef = collection(db, "events");

    // Fetch all documents in the "events" collection
    const snapshot = await getDocs(eventsCollectionRef);

    // Extract document IDs (event category names)
    snapshot.forEach((doc) => {
      categories.push(doc.id);
    });

    console.log("Event categories fetched successfully:", categories);
    return categories;
  } catch (error) {
    console.error("Error fetching event categories: ", error);
    throw new Error("Failed to fetch event categories");
  }
}
