// import CreateForm from "@/app/ui/lecture/createForm";

// export default async function CreateGuestLectures() {
//   return (
//     <>
//       <div className="bg-gray-900 p-4 shadow-md rounded-md">
//         <h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
//           Guest Lecture
//         </h1>
//         <h3 className="text-2xl py-2 font-bold font-mono"> Add GLs </h3>
//         <CreateForm />

//         {/* TODO: Update */}
//       </div>
//     </>
//   );
// }

"use client";
import GuestLectureTable from "@/app/ui/lecture/LectureTable";

export default function Home() {
    return (
        <div className="container mx-auto px-4 py-3">
            <div className="text-4xl w-full flex justify-center items-center mb-4">
                Hi! <span className="text-blue-500 font-mono font-black m-3">ADMINS</span>
            </div>
            <GuestLectureTable/>
        </div>
    );
}