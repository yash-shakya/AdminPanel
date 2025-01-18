"use client";

import { useEffect, useState } from "react";
import {
	getTechspardhaTeamById,
	updateTechspardhaTeam,
} from "@/app/actions/techspardha_teams";
import { TechspardhaTeam, Post } from "@/app/actions/techspardha_teams";
import UpdateTeamLogo from "./UpdateTeamLogo"; // Logo update component
import { BaseForm } from "../base_form";
import Image from "next/image";

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
	const handleContactUpdate = (
		index: number,
		updatedContact: Partial<TechspardhaTeam["contacts"][0]>
	) => {
		if (!teamData || !teamData.contacts) return;

		const updatedContacts = [...teamData.contacts];
		updatedContacts[index] = {
			...updatedContacts[index],
			...updatedContact,
		};

		setTeamData({ ...teamData, contacts: updatedContacts });
	};

	// Handler to delete a contact
	const handleContactDelete = (index: number) => {
		if (!teamData || !teamData.contacts) return;

		const updatedContacts = teamData.contacts.filter((_, i) => i !== index);
		setTeamData({ ...teamData, contacts: updatedContacts });
	};

	// Handler to add a new contact
	const handleAddContact = () => {
		if (!teamData) return;

		const newContact = {
			imageURL: "",
			name: "",
			post: Post.Convenor,
		};

		setTeamData({ ...teamData, contacts: [...teamData.contacts, newContact] });
	};

	// Handler for updating the logo in state
	const handleLogoUpdate = (newLogo: string) => {
		if (!teamData) return;

		setTeamData({ ...teamData, logo: newLogo });
	};

	// Final submit handler to update the team
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		let error_message = "";

		// Take button from the event
		const target = e.target as HTMLButtonElement;
		// Disable the button to prevent multiple clicks and show loading state
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
			// Reset the button
			target.disabled = false;
			target.innerText = "Submit";
			return;
		}

		try {
			// Proceed with the async operations to upload images and update the team
			const updatedTeamData = teamData && {
				teamName: id,
				logo: teamData.logo,
				contacts: await Promise.all(
					(teamData.contacts ?? []).map(async (contact) => ({
						name: contact.name,
						post: contact.post,
						imageURL: contact.imageURL, // Assuming images are already updated and no need for re-upload
					}))
				),
			};

			// Call the action to update the team
			if (updatedTeamData) {
				await updateTechspardhaTeam(id, updatedTeamData);
			} else {
				throw new Error("Updated team data is null.");
			}

			alert("Team updated successfully!");
			target.innerText = "Submitted";

			// Enable the button after a short delay
			setTimeout(() => {
				target.disabled = false;
				target.innerText = "Submit";
			}, 1000);
		} catch (error) {
			console.error("Error updating team: ", error);
			target.innerText = "Error...";
			target.style.backgroundColor = "red";

			// Enable the button after a short delay
			setTimeout(() => {
				target.disabled = false;
				target.innerText = "Submit";
				target.style.backgroundColor = ""; // Reset the button color
			}, 1000);

			alert("An error occurred while updating the team.");
		}
	};

	if (!teamData) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-full min-h-full flex flex-col justify-center items-center">
			{/* Client Component for managing the logo */}
			<UpdateTeamLogo
				initialLogo={teamData.logo || ""}
				onLogoUpdate={handleLogoUpdate}
			/>

			<div className="text-xl w-full flex flex-col mt-10">
				<h1 className="text-2xl font-black">Update Contacts</h1>
				<hr className="mb-5" />

				{/* Form to update the contacts */}
				{teamData.contacts.map((contact, index) => (
					<div
						key={index}
						className="flex flex-col gap-5 mb-5 border p-4 rounded"
					>
						<h2 className="text-xl font-semibold">Contact {index + 1}</h2>

						{/* Display and update contact image */}
						<div className="flex items-center gap-5">
							<Image
								src={contact.imageURL || "/placeholder.png"}
								alt={`Contact ${index + 1} Image`}
								width={100}
								height={100}
								className="rounded-full border"
							/>
							<label
								htmlFor={`contact-image-${index}`}
								className="cursor-pointer"
							>
								<input
									type="file"
									id={`contact-image-${index}`}
									hidden
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											const reader = new FileReader();
											reader.onload = () => {
												if (reader.result) {
													handleContactUpdate(index, {
														imageURL: reader.result.toString(),
													});
												}
											};
											reader.readAsDataURL(file);
										}
									}}
								/>
								<span className="text-blue-500 underline text-md">
									Change Image
								</span>
							</label>
						</div>

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
							submit={(data: { contactName: string; contactPost: Post }) =>
								handleContactUpdate(index, {
									name: data.contactName,
									post: data.contactPost,
								})
							}
						/>

						{/* Delete Button */}
						<button
							className="text-red-500 underline mt-2 self-start"
							onClick={() => handleContactDelete(index)}
						>
							Delete Contact
						</button>
					</div>
				))}

				{/* Add Contact Button */}
				<button
					className="text-white bg-green-500 px-4 py-2 rounded mt-5"
					onClick={handleAddContact}
				>
					+ Add Contact
				</button>

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
