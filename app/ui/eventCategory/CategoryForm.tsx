import { useState, useEffect } from "react";
import BaseCard from "../base_card";
import {
  getAllEventCategory,
  deleteEventCategory,
} from "@/app/actions/eventCategory";

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


export default function EventCategoryTable() {
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEventCategories();
  }, []);

  const loadEventCategories = async () => {
    try {
      const data = await getAllEventCategory();
      setEventCategories(data);
    } catch (err) {
      setError("Failed to load event categories");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  console.log(eventCategories);
  const handleDelete = async (id: string) => {
    try {
      await deleteEventCategory(id);
      setEventCategories(
        eventCategories.filter((category) => category.id !== id),
      );
    } catch (err) {
      console.error("Failed to delete event category:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg font-semibold text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {eventCategories.map((category) => {
        return (
          <BaseCard
            key={category.id}
            image={category.imgUrl || ""}
            title={category.eventCategory}
            data={[]}
            toEdit={`/panel/view/eventCategory/${category.id}`}
            onDelete={() => handleDelete(category.id)}
          />
        );
      })}
    </div>
  );
}
