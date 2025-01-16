import {
	getTechspardhaTeamById,
	updateTechspardhaTeam,
} from "@/app/actions/techspardha_teams";
import { TechspardhaTeam } from "@/app/actions/techspardha_teams";
// Props: Id of the team to be updated
interface UpdateTeamsProps {
	id: string;
}

export default async function UpdateTeams({ id }: UpdateTeamsProps) {
	// GetById query to fetch the team details
	const teamById: TechspardhaTeam = await getTechspardhaTeamById(id);

	if (!teamById) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div className="text-5xl w-full min-h-full flex justify-center items-center">
				Hi!{" "}
				<span className="text-blue-500 font-mono font-black m-10">
					<>{JSON.stringify(teamById)}</>
				</span>
			</div>
		</>
	);
}
