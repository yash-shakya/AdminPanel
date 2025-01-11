// "use client";

// import { useState } from "react";
// import { BaseForm } from "../base_form";
// import { createEventFormConfig } from "@/app/constants/events"; // Define form config for events
// import {Coordinator,Event, createEvent } from "@/app/actions/events"; // Action to handle event creation
// import createImgbbUrl from "@/app/helpers/imgbb"; // Helper to upload images
// import DatePicker from "react-datepicker"; // Import react-datepicker
// import "react-datepicker/dist/react-datepicker.css"; // Import default CSS


// interface EventFormState {
// 	eventName?: string;
// 	eventDescription?: string;
// 	eventStartDate?: string;
// 	eventEndDate?: string;
// 	eventBanner?: File;
// 	eventCategory?: string;
// 	eventVenue?: string;
// 	eventCoordinators?: Coordinator[];
// 	eventDocument?: string;
// 	eventFlagship?: boolean;
// 	eventRules?: string[];
// }


// export default function CreateEventForm() {
// 	const [form, setForm] = useState<EventFormState>({});
// 	const [errorText, setErrorText] = useState<string>("");
//     const [startTime, setStartTime] = useState<Date | null>(null); // State for start time
// 	const [endTime, setEndTime] = useState<Date | null>(null); // State for end time



    

// 	const handleCreateEvent = (data: {
// 		eventName: string;
// 		eventDescription: string;
// 		eventStartDate: string;
// 		eventEndDate: string;
// 		eventBanner: File;
// 	}) => {
// 		setForm((prev) => ({
// 			...prev,
// 			...data,
// 		}));
// 	};

// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();

// 		// Basic form validation
// 		if (
// 			!form.eventName ||
// 			!form.eventDescription ||
// 			!form.eventStartDate ||
// 			!form.eventEndDate ||
// 			!form.eventBanner
// 		) {
// 			setErrorText("Please fill all fields properly.");
// 			return;
// 		}

// 		try {
// 			// Prepare payload with uploaded banner
// 			const eventPayload: Event = {
//                 eventName: form.eventName!,
//                 description: form.eventDescription!,
//                 startTime: form.eventStartDate!, // Format Date to ISO string
//                 endTime: form.eventEndDate!,
//                 eventCategory: form.eventCategory || "General", // Replace with actual category
//                 venue: form.eventVenue || "TBD", // Replace with the actual venue
//                 coordinators: form.eventCoordinators || [], // Replace with actual coordinators
//                 document: form.eventDocument || "", // Replace with actual document link or description
//                 flagship: form.eventFlagship || false, // Boolean value, adjust based on form
//                 poster: form.eventBanner ? await createImgbbUrl(form.eventBanner) : null,
//                 rules: form.eventRules || [], // Replace with actual rules
//             };
            
            

// 			// Call the action to create the event
// 			await createEvent(eventPayload);
// 			setForm({}); // Reset form
// 			setErrorText(""); // Reset error message
// 			alert("Event Created Successfully");
// 		} catch (error) {
// 			console.error("Error creating event: ", error);
// 			setErrorText("An error occurred while creating the event.");
// 		}
// 	};

// 	return (
// 		<div className="create-event-form">
// 			<BaseForm {...createEventFormConfig} submit={handleCreateEvent} />
            
// 			<div className="flex items-center">
// 				<button
// 					type="button"
// 					onClick={handleSubmit}
// 					className="bg-green-500 hover:bg-green-700 duration-500 text-white font-bold px-2 text-2xl ml-auto rounded"
// 				>
// 					Create Event
// 				</button>
// 			</div>
// 			<div className="text-red-500 mt-2 font-mono">
// 				{errorText && <p>{errorText}</p>}
// 			</div>
// 		</div>
// 	);
// }


"use client";

import { useState } from "react";
import { BaseForm } from "../base_form";
import { createEventFormConfig } from "@/app/constants/events"; // Define form config for events
import { Coordinator, Event, createEvent } from "@/app/actions/events"; // Action to handle event creation
import createImgbbUrl from "@/app/helpers/imgbb"; // Helper to upload images
import DatePicker from "react-datepicker"; // Import react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import default CSS

interface EventFormState {
	eventName?: string;
	eventDescription?: string;
	eventCategory?: string;
	eventVenue?: string;
	eventCoordinators?: Coordinator[];
	eventDocument?: string;
	eventFlagship?: boolean;
	eventRules?: string[];
	eventBanner: File | null;
}

export default function CreateEventForm() {
	const [form, setForm] = useState<EventFormState>({
        eventName: "",
        eventDescription: "",
        eventCategory: "",
        eventVenue: "",
        eventCoordinators: [],
        eventDocument: "",
        eventFlagship: false,
        eventRules: [],
        eventBanner: null,
       
    });
	const [rules, setRules] = useState<string[]>([]); // State for managing rules
	const [newRule, setNewRule] = useState<string>(""); // State for the new rule being added
	const [errorText, setErrorText] = useState<string>("");
	const [startTime, setStartTime] = useState<Date | null>(null); // Start time state
	const [endTime, setEndTime] = useState<Date | null>(null); // End time state

	const handleCreateEvent = (data: Partial<EventFormState>) => {
		setForm((prev) => ({
			...prev,
			...data,
		}));
	};

	const handleAddRule = () => {
		if (newRule.trim()) {
			setRules((prev) => [...prev, newRule.trim()]);
			setNewRule(""); // Clear the input after adding
		}
	};

	const handleRemoveRule = (index: number) => {
		setRules((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Basic form validation
		if (
			!form.eventName ||
			!form.eventDescription ||
			!startTime ||
			!endTime ||
			!form.eventBanner
		) {
			setErrorText("Please fill all required fields.");
			return;
		}

		try {
			// Prepare payload
			const eventPayload: Event = {
				eventName: form.eventName!,
				description: form.eventDescription!,
				startTime: startTime.toISOString(), // Convert Date to ISO string
				endTime: endTime.toISOString(), // Convert Date to ISO string
				eventCategory: form.eventCategory || "General",
				venue: form.eventVenue || "TBD",
				coordinators: form.eventCoordinators || [],
				document: form.eventDocument || "",
				flagship: form.eventFlagship || false,
				poster: form.eventBanner ? await createImgbbUrl(form.eventBanner) : null,
				rules: rules, // Use the rules state
			};

			// Call action to create event
			await createEvent(eventPayload);
			setForm({eventName: "",
                eventDescription: "",
                eventCategory: "",
                eventVenue: "",
                eventCoordinators: [],
                eventDocument: "",
                eventFlagship: false,
                eventRules: [],
                eventBanner: null,});
			setStartTime(null);
			setEndTime(null);
			setRules([]);
			setErrorText("");
			alert("Event Created Successfully!");
		} catch (error) {
			console.error("Error creating event: ", error);
			setErrorText("An error occurred while creating the event.");
		}
	};

	return (
		<div className="create-event-form">
			<BaseForm {...createEventFormConfig} submit={handleCreateEvent} />

			<div className="date-picker-section">
				<div>
					<label className="block text-gray-700 font-bold mb-2">Start Time</label>
					<DatePicker
						selected={startTime}
						onChange={(date) => setStartTime(date)}
						showTimeSelect
						dateFormat="Pp"
						className="border rounded py-2 px-4"
						placeholderText="Select Start Time"
					/>
				</div>
				<div className="mt-4">
					<label className="block text-gray-700 font-bold mb-2">End Time</label>
					<DatePicker
						selected={endTime}
						onChange={(date) => setEndTime(date)}
						showTimeSelect
						dateFormat="Pp"
						className="border rounded py-2 px-4"
						placeholderText="Select End Time"
					/>
				</div>
			</div>

			{/* Rules Management */}
			<div className="rules-section mt-6">
				<label className="block text-gray-700 font-bold mb-2">Rules</label>
				<div className="flex items-center">
					<input
						type="text"
						value={newRule}
						onChange={(e) => setNewRule(e.target.value)}
						className="border rounded py-2 px-4 w-full"
						placeholder="Enter a rule"
					/>
					<button
						type="button"
						onClick={handleAddRule}
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
					>
						Add
					</button>
				</div>
				<ul className="list-disc mt-4 ml-5">
					{rules.map((rule, index) => (
						<li key={index} className="flex items-center mb-2">
							<span>{rule}</span>
							<button
								type="button"
								onClick={() => handleRemoveRule(index)}
								className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4"
							>
								Remove
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className="flex items-center mt-6">
				<button
					type="button"
					onClick={handleSubmit}
					className="bg-green-500 hover:bg-green-700 duration-500 text-white font-bold px-4 py-2 text-lg rounded"
				>
					Create Event
				</button>
			</div>

			<div className="text-red-500 mt-4 font-mono">
				{errorText && <p>{errorText}</p>}
			</div>
		</div>
	);
}
