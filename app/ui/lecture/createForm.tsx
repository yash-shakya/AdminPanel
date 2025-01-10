"use client";

import { useState } from "react";
import { BaseForm } from "../base_form";
import { createGuestLecture } from "@/app/constants/lecture";
import { createLecture } from "@/app/actions/lecture";

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
	const [forms, setForms] = useState<FormState[]>([{}]); // Array of forms
	const [errorText, setErrorText] = useState<string>("");

	const handleData = (index: number, data: FormState) => {
		const updatedForms = [...forms];
		updatedForms[index] = data;
		setForms(updatedForms);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		let error_message = "";

    // Take button from the event
    const target = e.target as HTMLButtonElement;
    // Disable the button to prevent multiple clicks and show loading state
    target.disabled = true;
    target.innerText = "Submitting...";

		// Validate each form
		for (const form of forms) {
			if (Object.keys(form).length === 0) {
				error_message = "Please fill all forms.";
				break;
			}
		}

		if (error_message) {
			setErrorText(error_message);
      // Reset the button
      target.disabled = false;
      target.innerText = "Submit";
			return;
		}

		try {
			for (const form of forms) {
				await createLecture(form as any); // Submit each form
			}
			setForms([{}]); // Reset forms
			setErrorText("");
      target.innerText = "Submitted";
      // Enable the button after 2 seconds
      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
      }, 1000);
      // Reload the page
      window.location.reload(); // TODO: This is a hacky way to reload the page after submitting the form (not recommended)
		} catch (error) {
			console.error("Error creating lectures: ", error);
      // Reset the button
      target.innerText = "Error...";
      target.style.backgroundColor = "red";
      // Enable the button after 2 seconds
      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
      }, 1000);
			setErrorText("An error occurred while creating the lectures");
		}
	};

	return (
		<div className="create-form">
			{forms.map((form, index) => (
				<div key={index} className="mb-4">
					<BaseForm
						{...createGuestLecture}
						submit={(data: FormState) => handleData(index, data)}
					/>
				</div>
			))}
			<div className="flex items-center mt-4 gap-5">
				<button
					type="button"
					onClick={handleSubmit}
					className="bg-green-500 ml-auto hover:bg-green-700 duration-500 text-white font-bold px-4 text-2xl rounded"
				>
					Submit
				</button>
			</div>
			<div className="text-red-500 mt-2 font-mono">
				{errorText && <p>{errorText}</p>}
			</div>
		</div>
	);
}
