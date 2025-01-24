import CreateForm from "@/app/ui/dev_team/createForm";

export default function Dev() {
  return (
    <>
      <div className="bg-gray-900 p-4 shadow-md rounded-md">
        <h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
          Dev Team
        </h1>
        <h3 className="text-2xl py-2 font-bold font-mono">
          {" "}
          Add Your Dev team members{" "}
        </h3>
        <CreateForm />

        {/* TODO: Update */}
      </div>
    </>
  );
}
