import CreateForm from "@/app/ui/app_dev_team/createForm";

export default function AppDev() {
  return (
    <>
      <div className="bg-gray-900 p-4 shadow-md rounded-md">
        <h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
          App dev team
        </h1>
        <h3 className="text-2xl py-2 font-bold font-mono">
          {" "}
          Add Your App dev team members{" "}
        </h3>
        <CreateForm />

        {/* TODO: Update */}
      </div>
    </>
  );
}
