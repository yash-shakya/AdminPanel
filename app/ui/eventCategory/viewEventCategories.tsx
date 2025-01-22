// "use client";
// import { useEffect, useState } from "react";
// import { getAllEventCategory } from "@/app/actions/eventCategory";
// import ViewEventCategoriesClientPage from "./ViewEventCategoriesClient";

// type EventCategory = {
//   id: string;
//   icon: string;
//   imgUrl: string;
//   events: Record<string, any>;
// };

// export default function ViewEventCategories() {
//   const [categories, setCategories] = useState<string[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const fetchedCategories = await getAllEventCategory();
//         setCategories(fetchedCategories);
//       } catch (err) {
//         setError("Failed to fetch event categories");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   if (loading) {
//     return <div>Loading categories...</div>;
//   }

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   return <ViewEventCategoriesClientPage categories={categories} />;
// }
