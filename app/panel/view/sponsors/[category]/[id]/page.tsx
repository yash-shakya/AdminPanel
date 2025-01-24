import UpdateSponsor from "@/app/ui/sponsors/updateForm";

export default async function Sponsor({
  params,
}: {
  params: Promise<{ id: string; category: string }>;
}) {
  const id = (await params).id;
  const category = (await params).category;
  return (
    <>
      <div className="bg-gray-900 p-4 shadow-md rounded-md overflow-clip">
        <h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
          Sponsors
        </h1>
        <h3 className="text-2xl py-2 font-bold font-mono"> Update Sponsor </h3>
        <UpdateSponsor id={id} category={category} />
      </div>
    </>
  );
}
