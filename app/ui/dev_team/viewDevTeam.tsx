"use client";

import { useEffect, useState } from "react";
import BaseCard from "../base_card";
import { deleteDevTeamMember, getDevTeamMembers } from "@/app/actions/dev_team";

interface DevMembersDTO {
  members: Array<{
    id: string;
    name: string;
    imageUrl: string;
    year?: string;
    linkedin?: string;
    insta?: string;
    github?: string;
  }>;
}

export default function ViewDevTeam() {
  const [teamList, setTeamList] = useState<DevMembersDTO["members"]>([]);

  useEffect(() => {
    const fetchDevTeamMembers = async () => {
      const teamMembers = await getDevTeamMembers();
      if ("err_desc" in teamMembers) {
        console.error(teamMembers.err_desc);
      } else {
        const devMembers = teamMembers.filter(
          (team) => team.id === "aboutDevs",
        );
        const members = devMembers.flatMap((team) => team.members || []);
        if (members.length > 0) {
          setTeamList(members);
        }
      }
    };
    fetchDevTeamMembers();
  }, []);

  const handleDelete = async (index: number) => {
    await deleteDevTeamMember(index);
    console.log(`Team ${index} deleted`);
    setTeamList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="dev-team">
      You cannot edit | only delete and add
      <div className="dev-team-list flex flex-wrap gap-7 p-4">
        {teamList.map((member, index) => (
          <BaseCard
            key={index}
            image={member.imageUrl}
            title={member.name}
            data={[
              { label: "Year", value: member.year || "" },
              { label: "LinkedIn", value: member.linkedin || "", isURL: true },
              { label: "Instagram", value: member.insta || "", isURL: true },
              { label: "GitHub", value: member.github || "", isURL: true },
            ]}
            toEdit={member.id || ""}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>
    </div>
  );
}
