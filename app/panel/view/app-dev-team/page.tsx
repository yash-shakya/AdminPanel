import ViewAppDevTeam from "@/app/ui/app_dev_team/viewAppDevTeam";

export default function Dev() {
  return (
    <>
      <div className="bg-gray-900 p-4 shadow-md rounded-md">
        <h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
          App Dev Team
        </h1>
        <ViewAppDevTeam />
      </div>
    </>
  );
}
