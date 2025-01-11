"use client";

import { useState } from "react";
import { BaseForm } from "../base_form";
import { createEventFormConfig } from "@/app/constants/events"; 
import { Coordinator, Event, createEvent } from "@/app/actions/events"; 
import createImgbbUrl from "@/app/helpers/imgbb"; 
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css"; 
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
    const [rules, setRules] = useState<string[]>([]); 
    const [newRule, setNewRule] = useState<string>(""); 
    const [errorText, setErrorText] = useState<string>("");
    const [startTime, setStartTime] = useState<Date | null>(null); 
    const [endTime, setEndTime] = useState<Date | null>(null); 
    const [loading, setLoading] = useState<boolean>(false); 
    const handleCreateEvent = (data: Partial<EventFormState>) => {
        setForm((prev) => ({
            ...prev,
            ...data,
        }));
    };

    const handleAddRule = () => {
        if (newRule.trim()) {
            setRules((prev) => [...prev, newRule.trim()]);
            setNewRule(""); 
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

        setLoading(true);

        try {
          
            const eventPayload: Event = {
                eventName: form.eventName!,
                description: form.eventDescription!,
                startTime: startTime.toISOString(), 
                endTime: endTime.toISOString(), 
                eventCategory: form.eventCategory || "General",
                venue: form.eventVenue || "TBD",
                coordinators: form.eventCoordinators || [],
                document: form.eventDocument || "",
                flagship: form.eventFlagship || false,
                poster: form.eventBanner ? await createImgbbUrl(form.eventBanner) : null,
                rules: rules, 
            };

           
            await createEvent(eventPayload);
            setForm({
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
            setStartTime(null);
            setEndTime(null);
            setRules([]);
            setErrorText("");
            alert("Event Created Successfully!");
        } catch (error) {
            console.error("Error creating event: ", error);
            setErrorText("An error occurred while creating the event.");
        } finally {
            setLoading(false);
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
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Event"}
                </button>
            </div>

            <div className="text-red-500 mt-4 font-mono">
                {errorText && <p>{errorText}</p>}
            </div>
        </div>
    );
}
