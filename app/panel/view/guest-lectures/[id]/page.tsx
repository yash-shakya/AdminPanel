import UpdateLecture from "@/app/ui/lecture/updateForm";

export default async function GuestLecture({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const slug = (await params).id;
    const id = slug;
    return (
        <>
            <div className="bg-gray-900 p-4 shadow-md rounded-md overflow-clip">
                <h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
                    Guest Lectures
                </h1>
                <h3 className="text-2xl py-2 font-bold font-mono">
                    {" "}
                    Update Guest Lecture{" "}
                </h3>
                <UpdateLecture id={id} />
            </div>
        </>
    );
}
