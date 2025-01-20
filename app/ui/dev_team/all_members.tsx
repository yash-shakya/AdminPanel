import { getDevTeamMemberById, getDevTeamMembers,DevTeamMember } from "@/app/actions/dev_team";
import ViewDevTeamsClient from "./ViewDevTeamClient";


export default async function viewMembers() {
    const members = await getDevTeamMembers();

    // Check if the response is an error
    if ('err_desc' in members) {
        // Handle the error case (e.g., show an error message)
        console.error(members.err_desc);
        return <div>Error fetching members</div>; // Or any other error handling
    }

    // Transform the members to match the DevTeamMember type
    const validMembers: DevTeamMember[] = members.map(member => ({
        id: member.id,
        name: member.name || '', // Provide default values if necessary
        year: member.year || '', // Provide default values if necessary
        imageUrl: member.imageUrl || '',
        linkedin: member.linkedin || '',
        github: member.github || '',
        instagram: member.instagram || '',
        image: member.image || '',
    }));

    return <ViewDevTeamsClient DevTeam={validMembers} />
}