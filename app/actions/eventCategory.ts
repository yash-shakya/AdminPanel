import { doc, getDoc, setDoc, getDocs, collection, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../db";
import createImgbbUrl from "../helpers/imgbb";


export type EventCategoryData = {
  eventCategory: string;
  image: string;
  index: number;
};

export type EventCategory = EventCategoryData & {
  id: string;
};

export type EventCategoryInput = {
  eventCategory: string;
  image: File;
};

// Actions
export async function createEventCategory(data: EventCategoryInput): Promise<void> {
  try {
    const imageResult = await createImgbbUrl(data.image);
    if (!imageResult?.url) {
      throw new Error("Image upload failed");
    }
    
    const randomIndex = Math.floor(1000 + Math.random() * 9000);
    const categoryData: EventCategoryData = {
      eventCategory: data.eventCategory,
      image: imageResult.url,
      index: randomIndex,
    };

   
    const docRef = collection(db, "eventCategories");
    await addDoc(docRef, categoryData);
  } catch (error) {
    console.error("Error creating event category:", error);
    throw new Error("Failed to create event category");
  }
}

export async function getAllEventCategory(): Promise<EventCategory[]> {
  const categories: EventCategory[] = [];

  try {
    const categoriesCollectionRef = collection(db, "eventCategories");
    const snapshot = await getDocs(categoriesCollectionRef);

    snapshot.forEach((doc) => {
      const data = doc.data() as EventCategoryData;
      categories.push({
        id: doc.id,
        ...data,
      });
    });

    
    return categories;
  } catch (error) {
    console.error("Error fetching event categories:", error);
    throw new Error("Failed to fetch event categories");
  }
}

export async function deleteEventCategory(id: string): Promise<void> {
  try {
    const categoryDocRef = doc(db, "eventCategories", id);
    await deleteDoc(categoryDocRef);
    console.log(`Event category with ID ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting event category:", error);
    throw new Error("Failed to delete event category");
  }
}

export async function getEventCategoryById(id: string): Promise<EventCategory> {
  try {
      const docRef = doc(db, "eventCategories", id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
          return {
              id: docSnap.id,
              ...docSnap.data()
          } as EventCategory;
      } else {
          throw new Error("Event category not found");
      }
  } catch (error) {
      console.error("Error fetching event category:", error);
      throw new Error("Failed to fetch event category");
  }
}

export async function updateEventCategory(
  id: string,
  updatedData: Partial<EventCategory>
): Promise<void> {
  try {
    const categoryRef = doc(db, "eventCategories", id);

    if (updatedData.image && typeof updatedData.image !== "string") {
      const imageResult = await createImgbbUrl(updatedData.image as File);
      if (!imageResult?.url) {
        throw new Error("Image upload failed");
      }
      updatedData.image = imageResult.url;
    }

    await updateDoc(categoryRef, updatedData);
    console.log("Event category updated successfully");
  } catch (error) {
    console.error("Error updating event category:", error);
    throw new Error("Failed to update event category");
  }
}
