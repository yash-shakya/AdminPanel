"use client";

import BaseCard from "../base_card";
import { deleteTechspardhaTeam } from "@/app/actions/techspardha_teams";

export default function ViewTeamsClient({ teamList }: { teamList: any[] }) {
  const handleDelete = async (teamId: string) => {
    // Handle delete functionality
    await deleteTechspardhaTeam(teamId);
    // Optionally refresh or update state here
    console.log(`Team ${teamId} deleted`);
  };

  const forURL = (id: string) => id.replace(" ", "-");

  return (
    <div className="flex flex-wrap justify-center items-center">
      {teamList.map((team, index) => (
        <div key={index} className="m-4">
          <BaseCard
            image={team.logo}
            title={team.id}
            data={[
              {
                label: "Convener",
                value:
                  team.contacts.find(
                    (contact: any) => contact.post === "Convener",
                  )?.name || "Not Available",
              },
            ]}
            toEdit={`techspardha-teams/${forURL(team.id)}`}
            onDelete={() => handleDelete(team.id)}
          />
        </div>
      ))}
    </div>
  );
}
