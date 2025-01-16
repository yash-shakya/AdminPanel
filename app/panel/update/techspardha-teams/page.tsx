import UpdateTeams from "@/app/ui/techspardha_teams/updateForm";

export default async function TechspardhaTeams() {
	return (
		<>
			<div className="bg-gray-900 p-4 shadow-md rounded-md overflow-clip">
				<h1 className="border-b pb-2 text-3xl font-black font-mono border-blue-200">
					Techspardha Teams
				</h1>
				<h3 className="text-2xl py-2 font-bold font-mono">
					{" "}
					Update Your Team{" "}
				</h3>
				<UpdateTeams id="Technobyte" />
			</div>
		</>
	);
}
