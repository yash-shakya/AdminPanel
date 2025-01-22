"use client"
import CreateForm from "@/app/ui/eventCategory/createForm";
import ViewEventCategories from "@/app/ui/eventCategory/viewEventCategories";

import { getAllEventCategory } from "@/app/actions/eventCategory";


type EventCategory = {
  eventCategory: string;
  image: string;
  index: number;
  id?:string;
};
import { useEffect, useState } from "react";

export default function EventCategoriesPage() {
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]); // State to store categories
  const [loading, setLoading] = useState<boolean>(true); // State to track loading status
  const [error, setError] = useState<string | null>(null); // State to track any errors

  useEffect(() => {
    // Fetch event categories when the component mounts
    const fetchEventCategories = async () => {
      try {
        const categories = await getAllEventCategory(); // Fetch categories
        console.log(categories);
        setEventCategories(categories); // Set the fetched categories to state
      } catch (error) {
        setError('Error fetching event categories');
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false when the fetch is complete
      }
    };

    fetchEventCategories(); // Call the fetch function
  }, []); // Empty dependency array means this runs once when the component mounts

  if (loading) return <div>Loading...</div>; // Show loading indicator
  if (error) return <div>{error}</div>; // Show error message if there's any error

  return (
    <div>
      <h1>Event Categories</h1>
     <ViewEventCategories/>
    </div>
  );
}
