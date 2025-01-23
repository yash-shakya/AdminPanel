"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getEventByName, updateEventByName } from "@/app/actions/events";
import { BaseForm } from "../base_form";
import { getAllEventCategory } from "@/app/actions/eventCategory";
import { createEventFormConfig } from "@/app/constants/events";
import Image from "next/image";

type Coordinator = {
  coordinator_name: string;
  coordinator_number: string;
};

interface EventCategory {
  id: string;
  eventCategory: string;
  image: string;
}

export default function UpdateEventForm({
  eventCategory,
  eventName,
}: {
  eventCategory: string;
  eventName: string;
}) {
  const [formData, setFormData] = useState<any>(null);
  const [coordinators, setCoordinators] = useState<Coordinator[]>([]);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [eventData, categoriesData] = await Promise.all([
          getEventByName(eventCategory, eventName),
          getAllEventCategory()
        ]);

        if (eventData) {
          const processedEventData = {
            ...eventData,
            rules: Array.isArray(eventData.rules) 
              ? eventData.rules 
              : (eventData.rules || '').split('|').filter((rule: string)=> rule.trim()),
            flagship: eventData.flagship === 'true' || eventData.flagship === true
          };

          setFormData(processedEventData);
          setCategories(categoriesData);
          setCoordinators(eventData.coordinators || [
            { coordinator_name: "", coordinator_number: "" },
            { coordinator_name: "", coordinator_number: "" }
          ]);
          setImageURL(eventData.imageURL || null);
        } else {
          setErrorText("Event not found.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorText("Error loading event data or categories.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [eventCategory, eventName]);

  const dynamicEventFormConfig = {
    ...createEventFormConfig,
    fields: createEventFormConfig.fields.map((field) =>
      field.name === "eventCategory"
        ? {
            ...field,
            options: loading
              ? ["Loading..."]
              : categories.map((category) => category.eventCategory),
            placeholder: loading
              ? "Loading categories..."
              : "Select the category",
          }
        : field
    ),
  };

  const handleCoordinatorChange = (index: number, field: string, value: string) => {
    const updatedCoordinators = [...coordinators];
    updatedCoordinators[index] = { ...updatedCoordinators[index], [field]: value };
    setCoordinators(updatedCoordinators);
  };

  const addCoordinator = () => {
    if (coordinators.length < 5) {
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

    // Ensure rules are processed as an array
    const processedRules = Array.isArray(formData.rules) 
      ? formData.rules 
      : (formData.rules || '').split('|').filter((rule: string) => rule.trim());

    try {
      await updateEventByName(eventCategory, eventName, { 
        ...formData, 
        coordinators,
        rules: processedRules,
        flagship: formData.flagship ? 'true' : 'false'
      });
      alert("Event updated successfully!");
      router.push("/panel/view/events");
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
        {...dynamicEventFormConfig}
        defaultValues={formData}
        submit={(data: any) => {
          // Convert rules to array if they're a string
          const processedData = {
            ...data,
            rules: Array.isArray(data.rules) 
              ? data.rules 
              : (data.rules || '').split('|').filter((rule: string) => rule.trim()),
            flagship: data.flagship === 'true' || data.flagship === true
          };
          setFormData({ ...formData, ...processedData });
        }}
      />

      {/* Image display section */}
      {imageURL && (
        <div className="mt-4">
          <h4 className="font-bold mb-2">Current Event Poster</h4>
          <Image 
            src={imageURL} 
            alt="Event Poster" 
            width={200} 
            height={200} 
            className="object-cover rounded"
          />
        </div>
      )}

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