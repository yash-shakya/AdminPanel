"use client"

import { deleteDevTeamMember } from "@/app/actions/dev_team"
import BaseCard from "../base_card"

type YEAR =
	| "Freshman"
	| "Sophomore"
	| "Pre-Final Year"
	| "Final Year"
	| "Super Senior";

type DevTeamMember = {
	name: string;
	imageUrl?: string | null;
	year: YEAR;
	linkedin?: string;
	github?: string;
	instagram?: string;
	image?: File | null;
    id?:string
};

export default function ViewDevTeamsClient(
	{ DevTeam } : { DevTeam:DevTeamMember[] }
){
    const handleDelete=async(memberId:string)=>{
        await deleteDevTeamMember(memberId);
        console.log(`Member ${memberId} deleted`);
    }

    return (
        <div className="flex flex-wrap justify-center items-center">
		{DevTeam.map((member, i) => {
				const dataArray: { label: string; value: string; isUrl?: boolean }[] =
				[];
				
				dataArray.push({
				label: "imageUrl",
				value: member.imageUrl as string,
				isUrl: true,
				});
				dataArray.push({ label: "name", value: member.name });
				dataArray.push({ label: "id", value: member.id as string });
				dataArray.push({ label: "year", value: member.year });
				dataArray.push({ label: "LinkedIn", value:member.linkedin as string});
				dataArray.push({ label: "instagram", value:member.instagram as string});
				dataArray.push({ label: "github", value:member.github as string});
				return (
				<div key={i} className="m-4">
					<BaseCard
					data={dataArray}
					title={member.name}
					image={member.imageUrl as string}
					toEdit={`update/dev_team/${member.id}`}
					onDelete={() => handleDelete(member.id as string)}
					/>
				</div>
				);
			})}

		</div>
    )

}