import { database, ref, get, update, remove, push, set } from "@/app/db";
import createImgbbUrl from "../helpers/imgbb";

export type EventCategoryData = {
  eventCategory: string;
  icon: string;
  imgUrl: string;
  index: number;
  image?: string; // for updatedData
};

export type EventCategory = EventCategoryData & {
  id: string;
};

export type EventCategoryInput = {
  eventCategory: string;
  image: File;
};

// Actions
export async function createEventCategory(
  data: EventCategoryInput,
): Promise<void> {
  try {
    const imageResult = await createImgbbUrl(data.image);
    if (!imageResult?.url) {
      throw new Error("Image upload failed");
    }

    const randomIndex = Math.floor(1000 + Math.random() * 9000);
    const categoryData: EventCategoryData = {
      eventCategory: data.eventCategory,
      imgUrl: imageResult?.url,
      icon: imageResult?.thumb as string,
      index: randomIndex,
    };

    const categoriesRef = ref(database, "eventCategories");
    await push(categoriesRef, categoryData);
    console.log("Event category created successfully");
  } catch (error) {
    console.error("Error creating event category:", error);
    throw new Error("Failed to create event category");
  }
}

export async function getAllEventCategory(): Promise<EventCategory[]> {
  const categories: EventCategory[] = [];

  try {
    const categoriesRef = ref(database, "events");
    const snapshot = await get(categoriesRef);

    if (!snapshot.exists()) {
      throw new Error("Internal server error");
    }
    const val = snapshot.val() as EventCategory[];

    const resp = Object.entries(val).map(([category,categoryData]) => {
      return {...categoryData,eventCategory: category,id: category};
    })

    return resp;
  } catch (error) {
    console.error("Error fetching event categories:", error);
    throw new Error("Failed to fetch event categories");
  }
}

export async function deleteEventCategory(id: string): Promise<void> {
  try {
    const categoryRef = ref(database, `eventCategories/${id}`);
    await remove(categoryRef);
    console.log(`Event category with ID ${id} deleted successfully`);
  } catch (error) {
    console.error("Error deleting event category:", error);
    throw new Error("Failed to delete event category");
  }
}

export async function getEventCategoryById(id: string): Promise<EventCategory> {
  try {
    const categoryRef = ref(database, `events/${id}`);
    const snapshot = await get(categoryRef);
    console.log("hoihsaf;oihasdf",snapshot.val());
    if (snapshot.exists()) {
      const val = snapshot.val();
      return {
        id,
        ...(val as EventCategoryData),
      };
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
  updatedData: Partial<EventCategory>,
): Promise<void> {
  try {
    const categoryRef = ref(database, `eventCategories/${id}`);

    if (updatedData.image && typeof updatedData.image !== "string") {
      const imageResult = await createImgbbUrl(updatedData.image as File);
      if (!imageResult?.url) {
        throw new Error("Image upload failed");
      }
      updatedData.image = imageResult.url;
    }

    await update(categoryRef, updatedData);
    console.log("Event category updated successfully");
  } catch (error) {
    console.error("Error updating event category:", error);
    throw new Error("Failed to update event category");
  }
}
