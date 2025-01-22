"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getEventByName, updateEventByName } from "@/app/actions/events"; // Import backend functions
import { BaseForm } from "../base_form"; // Assuming you have a BaseForm component
import { createEventCategoryConfig } from "@/app/constants/eventCategory"; // Assuming you have a config for your form

export default function UpdateEventForm({
  eventCategory,
  eventName,
}: {
  eventCategory: string;
  eventName: string;
}) {
  const [formData, setFormData] = useState<any>(null); // Store form data
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchEventData() {
      try {
        const eventData = await getEventByName(eventCategory, eventName); // Fetch event data
        if (eventData) {
          setFormData(eventData); // Pre-populate with data for the specific event
        } else {
          setErrorText("Event not found.");
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
        setErrorText("Error loading event data.");
      } finally {
        setLoading(false);
      }
    }

    fetchEventData();
  }, [eventCategory, eventName]);

  const handleData = (data: any) => {
    setFormData(data); // Update local form state
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) {
      setErrorText("Form data is invalid or empty.");
      return;
    }

    try {
      await updateEventByName(eventCategory, eventName, formData); // Update Firestore document
      alert("Event updated successfully!");
      router.push("/events"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating event:", error);
      setErrorText("Failed to update event.");
    }
  };

  if (loading) return <p>Loading event data...</p>;
  if (errorText) return <p className="text-red-500">{errorText}</p>;

  return (
    <div className="update-event-form">
      <BaseForm
        {...createEventCategoryConfig}
        defaultValues={formData} // Populate form with data
        submit={handleData}
      />
      <div className="flex items-center mt-4 gap-5">
        <button
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-700 duration-500 text-white font-bold px-4 py-2 rounded"
        >
          Update Event
        </button>
      </div>
      <div className="text-red-500 mt-2 font-mono">
        {errorText && <p>{errorText}</p>}
      </div>
    </div>
  );
}
