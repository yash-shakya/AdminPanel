// "use client";
// import React from "react";
// import BaseCard from "../base_card";
// import { deleteEventCategory } from "@/app/actions/events";

// type EventCategory = {
//   id: string;
//   icon: string;
//   imgUrl: string;
//   events: Record<string, any>;
// };

// export default function ViewEventCategoryClientPage({
//   categories,
 
// }: {
//   categories: string[];
 
// }) {
//   const handleDelete = async (categoryId: string) => {
//     if (!window.confirm(`Are you sure you want to delete category '${categoryId}'?`)) return;
//     try {
//       await deleteEventCategory(categoryId);
//       console.log(`Category ${categoryId}  deleted`);
//     } catch (error) {
//       console.error("Failed to delete category:", error);
//     }
//   };

//   return (
//     <div className="flex flex-wrap justify-center items-center">
//       {categories.map((category) => (
//         <div key={category} className="m-4">
//           <BaseCard
//             data={[{ label: "Category Name", value: category }]}
//             title={category}
            
//             toEdit={`/update/event-categories/${category}`}
//             onDelete={() => handleDelete(category)}
//           />
//         </div>
//       ))}
//     </div>
//   );
// }
