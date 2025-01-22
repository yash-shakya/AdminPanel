import ViewGuestLectures from "@/app/ui/lecture/ViewLecture";

export default async function ViewGuestLectureServer() {
  return (
    <>
      <div className="bg-gray-900 p-4 shadow-md rounded-md">
        <h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
          Guest Lecture
        </h1>
        <h3 className="text-2xl py-2 font-bold font-mono"> view GLs </h3>
        <ViewGuestLectures />
      </div>
    </>
  );
}