"use client";

import { useEffect, useState } from "react";
import { getTechspardhaTeamById, updateTechspardhaTeam } from "@/app/actions/techspardha_teams";
import { TechspardhaTeam, Post } from "@/app/actions/techspardha_teams";
import UpdateTeamLogo from "./UpdateTeamLogo"; // Logo update component
import { BaseForm } from "../base_form";

// Props: Id of the team to be updated
interface UpdateTeamsProps {
	id: string;
}

export default function UpdateTeams({ id }: UpdateTeamsProps) {
	// State to manage the team data
	const [teamData, setTeamData] = useState<TechspardhaTeam | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Fetch the team data on component mount
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

	// Handler to update a specific contact in state
	const handleContactUpdate = (index: number, updatedContact: any) => {
		if (!teamData) return;

		const updatedContacts = [...teamData.contacts];
		updatedContacts[index] = {
			...updatedContacts[index],
			...updatedContact,
		};

		setTeamData({ ...teamData, contacts: updatedContacts });
	};

	// Handler for updating the logo in state
	const handleLogoUpdate = (newLogo: string) => {
		if (!teamData) return;

		setTeamData({ ...teamData, logo: newLogo });
	};

	// Final submit handler to update the team
	const handleSubmit = async () => {
		if (!teamData) return;

		setIsSubmitting(true);
		try {
			await updateTechspardhaTeam(id, teamData);
			alert("Team updated successfully!");
		} catch (error) {
			console.error("Error updating team:", error);
			alert("Failed to update the team.");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!teamData) {
		return <div>Loading...</div>;
	}

	return (
		<div className="text-5xl w-full min-h-full flex flex-col justify-center items-center">
			{/* Client Component for managing the logo */}
			<UpdateTeamLogo initialLogo={teamData.logo || ""} onLogoUpdate={handleLogoUpdate} />
			
			<div className="text-3xl w-full flex flex-col mt-10">
				<h1>Update Contacts</h1>
				<hr className="mb-5" />
				
				{/* Form to update the contacts */}
				{teamData.contacts.map((contact, index) => (
					<div key={index} className="flex flex-col gap-5 mb-5">
						<BaseForm
							title={`Update Contact ${index + 1}`}
							fields={[
								{
									name: "contactName",
									label: "Contact Name",
									type: "text" as const,
									value: contact.name,
								},
								{
									name: "contactPost",
									label: "Contact Post",
									type: "select" as const,
									options: Object.values(Post),
									value: contact.post,
								},
							]}
							submitText="Update Contact"
							submit={(data: { contactName: string; contactPost: Post }) => handleContactUpdate(index, data)}
						/>
					</div>
				))}

				{/* Final Submit Button */}
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
