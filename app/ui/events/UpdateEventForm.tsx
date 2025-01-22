"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getEventByName, updateEventByName } from "@/app/actions/events";
import { BaseForm } from "../base_form";
import { createEventFormConfig } from "@/app/constants/events"; 
type Coordinator = {
  coordinator_name: string;
  coordinator_number: string;
};

export default function UpdateEventForm({
  eventCategory,
  eventName,
}: {
  eventCategory: string;
  eventName: string;
}) {
  const [formData, setFormData] = useState<any>(null); // Store form data
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]); // Store coordinators
  const [imageURL, setImageURL] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchEventData() {
      try {
        const eventData = await getEventByName(eventCategory, eventName); // Fetch event data
        //console.log(eventData.coordinators);
        if (eventData) {
          setFormData(eventData);
          setCoordinators(eventData.coordinators || [{ coordinator_name: "", coordinator_number: "" }, { coordinator_name: "", coordinator_number: "" }]); // Ensure at least two coordinators
 // Pre-populate coordinators
 setImageURL(eventData.imageURL || null);
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

  const handleCoordinatorChange = (index: number, field: string, value: string) => {
    const updatedCoordinators = [...coordinators];
    updatedCoordinators[index] = { ...updatedCoordinators[index], [field]: value };
    setCoordinators(updatedCoordinators);
  };

  const addCoordinator = () => {
    if (coordinators.length < 5) { // Limit to a maximum of 5 coordinators
      setCoordinators([...coordinators, { coordinator_name: "", coordinator_number: "" }]);
    }
  };

  const removeCoordinators = () => {
    if (coordinators.length === 2) {
      setErrorText("At least two coordinators are required");
      setTimeout(() => setErrorText(""), 2000);
      return;
    }
    setCoordinators(coordinators.slice(0, coordinators.length - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData || !formData.eventName || !formData.startTime || !formData.endTime) {
      setErrorText("Please fill in all required fields.");
      return;
    }

    if (coordinators.length < 2) {
      setErrorText("At least two coordinators are required.");
      return;
    }

    for (const coordinator of coordinators) {
      if (!coordinator.coordinator_name || !coordinator.coordinator_number) {
        setErrorText("Please fill in all coordinator details.");
        return;
      }
    }

    try {
      await updateEventByName(eventCategory, eventName, { ...formData, coordinators });
      alert("Event updated successfully!");
      router.push("/panel/view/events"); // Redirect after successful update
    } catch (error) {
      console.error("Error updating event:", error);
      setErrorText("Failed to update event.");
    }
  };

  if (loading) return <p>Loading event data...</p>;
  if (errorText) return <p className="text-red-500">{errorText}</p>;

  return (
    <div>
      <BaseForm
        {...createEventFormConfig}
        defaultValues={formData} // Populate form with data
        submit={(data: any) => setFormData({ ...formData, ...data })}
      />

      <h3 className="mt-4 font-bold">Coordinators</h3>
      
      {coordinators.map((coordinator, index) => (
        <div key={index} className="flex flex-col mb-2">
          <input
            type="text"
            placeholder="Coordinator Name"
            value={coordinator.coordinator_name}
            onChange={(e) => handleCoordinatorChange(index, "coordinator_name", e.target.value)}
            className="border text-black p-2 rounded"
          />
          <input
            type="text"
            placeholder="Coordinator Number"
            value={coordinator.coordinator_number}
            onChange={(e) => handleCoordinatorChange(index, "coordinator_number", e.target.value)}
            className="border text-black p-2 rounded mt-1"
          />
        
        </div>
      ))}

      <div className="flex items-center gap-5">
        <button
          onClick={addCoordinator}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 text-3xl rounded-full"
        >
          +
        </button>
        <button
          onClick={removeCoordinators}
          className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 text-3xl rounded-full"
        >
          -
        </button>
        <button
          type="submit"
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
