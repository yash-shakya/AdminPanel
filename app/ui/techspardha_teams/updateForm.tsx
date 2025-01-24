"use client";

import { useEffect, useState } from "react";
import {
  getTechspardhaTeamById,
  updateTechspardhaTeam,
} from "@/app/actions/techspardha_teams";
import { TechspardhaTeam, Post } from "@/app/actions/techspardha_teams";
import UpdateTeamLogo from "./UpdateTeamLogo";
import BaseUpdateForm from "@/app/ui/base_update_form";

interface UpdateTeamsProps {
  id: string;
}

export default function UpdateTeams({ id }: UpdateTeamsProps) {
  const [teamData, setTeamData] = useState<TechspardhaTeam | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const data = await getTechspardhaTeamById(id);
        setTeamData(data);
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };

    fetchTeamData();
  }, [id]);

  const handleContactUpdate = (
    index: number,
    updatedContact: Partial<TechspardhaTeam["contacts"][0]>,
  ) => {
    if (!teamData || !teamData.contacts) return;
    const updatedContacts = [...teamData.contacts];
    updatedContacts[index] = {
      ...updatedContacts[index],
      ...updatedContact,
    };
    setTeamData({ ...teamData, contacts: updatedContacts });
  };

  const handleContactDelete = (index: number) => {
    if (!teamData || !teamData.contacts) return;
    const updatedContacts = teamData.contacts.filter((_, i) => i !== index);
    setTeamData({ ...teamData, contacts: updatedContacts });
  };

  const handleAddContact = () => {
    if (!teamData) return;
    const newContact = {
      imageURL: "",
      name: "",
      post: Post.Convenor,
    };
    setTeamData({ ...teamData, contacts: [...teamData.contacts, newContact] });
  };

  const handleLogoUpdate = (newLogo: string) => {
    if (!teamData) return;
    setTeamData({ ...teamData, logo: newLogo });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error_message = "";
    const target = e.target as HTMLButtonElement;
    target.disabled = true;
    target.innerText = "Submitting...";

    if (!teamData) {
      error_message = "Team data is missing.";
    } else if (teamData.contacts?.length === 0) {
      error_message = "Please fill the contact details.";
    } else if (!teamData.logo) {
      error_message = "Please fill the team details.";
    } else {
      for (const contact of teamData.contacts || []) {
        if (!contact.name || !contact.post || !contact.imageURL) {
          error_message = "Please fill the contact details properly.";
          break;
        }
      }
    }

    if (error_message) {
      alert(error_message);
      target.disabled = false;
      target.innerText = "Submit";
      return;
    }

    try {
      const updatedTeamData = teamData && {
        teamName: id,
        logo: teamData.logo,
        contacts: await Promise.all(
          (teamData.contacts ?? []).map(async (contact) => ({
            name: contact.name,
            post: contact.post,
            imageURL: contact.imageURL,
          })),
        ),
      };

      if (updatedTeamData) {
        await updateTechspardhaTeam(id, updatedTeamData);
      } else {
        throw new Error("Updated team data is null.");
      }

      alert("Team updated successfully!");
      target.innerText = "Submitted";
      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
      }, 1000);
    } catch (error) {
      console.error("Error updating team: ", error);
      target.innerText = "Error...";
      target.style.backgroundColor = "red";
      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
        target.style.backgroundColor = "";
      }, 1000);
      alert("An error occurred while updating the team.");
    }
  };

  if (!teamData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-full flex flex-col justify-center items-center">
      <UpdateTeamLogo
        initialLogo={teamData.logo || ""}
        onLogoUpdate={handleLogoUpdate}
      />
      <h1 className="text-4xl"> {id} </h1>

      <div className="text-xl w-full flex flex-col mt-10">
        <h1 className="text-2xl font-black">Update Contacts</h1>
        <hr className="mb-5" />

        {teamData.contacts.map((contact, index) => (
          <BaseUpdateForm
            key={index}
            index={index}
            contact={contact}
            onUpdate={handleContactUpdate}
            onDelete={handleContactDelete}
          />
        ))}

        <button
          className="text-white bg-green-500 px-4 py-2 rounded mt-5"
          onClick={handleAddContact}
        >
          + Add Contact
        </button>

        <button
          className={`mt-5 px-5 py-2 text-white rounded ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
          }`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Changes"}
        </button>
      </div>
    </div>
  );
}
