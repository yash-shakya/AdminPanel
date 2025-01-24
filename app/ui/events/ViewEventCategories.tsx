import { getAllEventsByCategory } from "@/app/actions/events";
import ViewEventCategoriesClient from "./ViewEventCategoriesClient";

export default async function ViewEventCategories() {
  const categories = await getAllEventsByCategory();
  return <ViewEventCategoriesClient categories={categories} />;
}
