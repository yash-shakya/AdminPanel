import { getAllTechspardhaTeams } from "@/app/actions/techspardha_teams";
// Purpose : This file is used to display all the teams of techspardha.
export default async function ViewTeams() {
	// Fetch all the teams
	const teams = await getAllTechspardhaTeams();

	// Make an array of all
	const teamNames = Object.keys(teams);
	const teamArray = Object.values(teams);
	// Create a list of all the teams
	const teamList = teamArray.map((team, index) => {
		return { ...team, id: teamNames[index] };
	});

	console.table(teamList);

	return (
		<>
			<div className="text-5xl w-full min-h-full flex justify-center items-center">
				<TableView data={teamList} />
			</div>
		</>
	);
}

// A table component that can be used by any page to display the data just pass an array of objects and it will display the data in a table format. (just as console.table does)
export function TableView({ data }: { data: any[] }) {
	return (
		<table className="table-auto">
			<thead>
				<tr>
					{Object.keys(data[0]).map((key) => (
						<th key={key}>{key}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.map((row, index) => (
					<tr key={index}>
						{Object.values(row).map((value, index) => (
							<td key={index}>{typeof value === 'object' ? '' : (value as any)}</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
