import { getAllTechspardhaTeams } from "@/app/actions/techspardha_teams";
import ViewTeamsClient from "@/app/ui/techspardha_teams/ViewTeamClient";
export default async function ViewTeams() {
	// Fetch all the teams
	const teams = await getAllTechspardhaTeams();

	// Make an array of all teams
	const teamNames = Object.keys(teams);
	const teamArray = Object.values(teams);
	const teamList = teamArray.map((team, index) => ({
		...team,
		id: teamNames[index],
	}));

	return <ViewTeamsClient teamList={teamList} />;
}
