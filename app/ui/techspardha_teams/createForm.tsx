"use client";

import { useState } from "react";
import { BaseForm } from "../base_form";
import {
	createTeamFormConfig,
	addContactFormConfig,
} from "@/app/constants/techspardha_teams";
import { createTechspardhaTeam } from "@/app/actions/techspardha_teams";
import createImgbbUrl from "@/app/helpers/imgbb";

interface Contact {
	contactName: string;
	contactPost: string;
	contactImage: File;
}

interface FormState {
	teamName?: string;
	teamLogo?: File;
	contacts?: Contact[];
}

export default function CreateForm() {
	const [contacts, setContacts] = useState([0, 1]); // Indexes of contacts

	const [form, setForm] = useState<FormState>({});
	const [errorText, setErrorText] = useState<string>("");

	const addContact = () => {
		setContacts([...contacts, contacts.length]);
	};
	const removeContact = () => {
		// If there is 2 contacts and the user tries to remove one, show an error
		if (contacts.length === 2) {
			setErrorText("At least two contacts are required.");
			// After 2 seconds, remove the error message
			setTimeout(() => setErrorText(""), 2000);
			return;
		}
		setContacts(contacts.slice(0, contacts.length - 1)); // Remove the last contact
	};

	const handleCreateTeam = (data: { teamName: string; teamLogo: File }) => {
		setForm((prev) => ({
			...prev,
			teamName: data.teamName,
			teamLogo: data.teamLogo,
		}));
	};

	const handleAddContact = (data: {
		contactName: string;
		contactPost: string;
		contactImage: File;
	}) => {
		setForm((prev) => ({
			...prev,
			contacts: [
				...(prev.contacts || []),
				{
					contactName: data.contactName,
					contactPost: data.contactPost,
					contactImage: data.contactImage,
				},
			],
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		let error_message = "";

		console.log(form);

		if (Object.keys(form).length === 0) {
			error_message = "Please fill the form";
		} else if (form.contacts?.length === 0) {
			error_message = "Please fill the contact details";
		} else if (form?.teamName === "" || !form?.teamLogo) {
			error_message = "Please fill the team details";
		} else {
			for (const contact of form.contacts || []) {
				if (
					contact.contactName === "" ||
					!contact.contactPost ||
					!contact.contactImage
				) {
					error_message = "Please fill the contact details properly";
					break;
				}
			}
		}

		if (error_message) {
			setErrorText(error_message);
			return;
		}

		// Proceed with the async operations to upload images and create the team
		const CreateTechspardhaTeamArgs = {
			team: form.teamName,
			data: {
				logo: form.teamLogo ? await createImgbbUrl(form.teamLogo) : null,
				contacts: await Promise.all(
					(form.contacts ?? []).map(async (contact: Contact) => ({
						name: contact.contactName,
						post: contact.contactPost,
						imageURL: await createImgbbUrl(contact.contactImage),
					}))
				),
			},
		};

		try {
			// Call the action to create the team
			await createTechspardhaTeam(
				CreateTechspardhaTeamArgs.team || "",
				CreateTechspardhaTeamArgs.data
			);
			setForm({});
			setContacts([0, 1]);
			setErrorText(""); // Reset error message
			alert("Team Created Successfully");
		} catch (error) {
			console.error("Error creating team: ", error);
			setErrorText("An error occurred while creating the team");
		}
	};

	return (
		<div className="create-form">
			<BaseForm {...createTeamFormConfig} submit={handleCreateTeam} />
			{contacts.map((contact, index) => (
				<BaseForm
					key={index}
					{...addContactFormConfig}
					submit={handleAddContact}
				/>
			))}
			<div className="flex items-center gap-5">
				<button
					onClick={addContact}
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 text-3xl rounded-full"
				>
					+
				</button>
				<button
					onClick={removeContact}
					className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 text-3xl rounded-full"
				>
					-
				</button>
				<button
					type="button"
					onClick={handleSubmit}
					className="bg-green-500 hover:bg-green-700 duration-500 text-white font-bold px-2 text-2xl ml-auto rounded"
				>
					Create Team
				</button>
			</div>
			<div className="text-red-500 mt-2 font-mono">
				{errorText && <p>{errorText}</p>}
			</div>
		</div>
	);
}
