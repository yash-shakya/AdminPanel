import { useState, useEffect } from "react";
import { createEvent, getAllEvents } from "@/app/actions/events";
import { BaseForm } from "../base_form";
import { createEventFormConfig, addCoordinatorFormConfig } from "@/app/constants/events";

type Coordinator = {
  coordinator_name: string;
  coordinator_number: string;
};

interface FormState {
  coordinators: Coordinator[];
  description: string;
  document: string;
  endTime: number;
  eventCategory: string;
  eventName: string;
  flagship: boolean;
  rules: string[];
  startTime: number;
  venue: string;
  image: File;
}

export default function CreateForm() {

      useEffect(() => {
        const fetchEvents = async () => {
          try {
            const fetchedEvents = await getAllEvents(); // Adjusted to handle the nested structure
            console.log(fetchedEvents);
            
          } catch (err) {
          
            console.error(err);
          } finally {
          console.log("Success!!")
          }
        };
    
        fetchEvents();
      }, []);
    


  const [coordinators, setCoordinators] = useState([0, 1]); // Initial two coordinators
  const [form, setForm] = useState<FormState>({} as FormState);
  const [errorText, setErrorText] = useState<string>("");

  const addCoordinators = () => {
    setCoordinators([...coordinators, coordinators.length]);
  };

  const removeCoordinators = () => {
    if (coordinators.length === 2) {
      setErrorText("At least two coordinators are required");
      setTimeout(() => setErrorText(""), 2000);
      return;
    }
    setCoordinators(coordinators.slice(0, coordinators.length - 1));
  };

  const handleFormCreate = (data: FormState) => {
    setForm((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const handleAddCoordinators = (data: Coordinator) => {
    setForm((prev) => {
      const updatedCoordinators = [...(prev.coordinators || []), data];
      return {
        ...prev,
        coordinators: updatedCoordinators, // Correctly update coordinators
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error_message = "";

    const target = e.target as HTMLButtonElement;
    target.disabled = true;
    target.innerText = "Submitting...";

    // Access coordinators directly from the form state
    const { coordinators, eventName, startTime, endTime } = form;

    // Validation checks for empty fields and required coordinators
    if (!eventName || !startTime || !endTime) {
      error_message = "Please fill in all the event details";
    } else if (coordinators.length < 2) {
      error_message = "At least two coordinators are required";
    } else {
      for (const coordinator of coordinators) {
        if (!coordinator.coordinator_name || !coordinator.coordinator_number) {
          error_message = "Please fill in all coordinator details properly";
          break;
        }
      }
    }

    if (error_message) {
      setErrorText(error_message);
      target.disabled = false;
      target.innerText = "Submit";
      return;
    }

    try {
      // Ensure coordinators are unique and handle submission
      const uniqueCoordinators = Array.from(
        new Map(coordinators.map((c) => [c.coordinator_number, c])).values()
      );

      await createEvent({ ...form, coordinators: uniqueCoordinators });
      setForm({} as FormState);
      setCoordinators([0, 1]); // Reset coordinators to initial state
      setErrorText("");
      target.innerText = "Submitted";
      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
      }, 1000);
      window.location.reload(); // Or redirect as needed
    } catch (error) {
      console.error("Error creating event: ", error);
      target.innerText = "Error...";
      target.style.backgroundColor = "red";
      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
      }, 1000);
      setErrorText("An error occurred while creating the event");
    }
  };

  return (
    <div className="create-form">
      <BaseForm {...createEventFormConfig} submit={handleFormCreate} />
      {coordinators.map((_, index) => (
        <BaseForm key={index} {...addCoordinatorFormConfig} submit={handleAddCoordinators} />
      ))}
      <div className="flex items-center gap-5">
        <button
          onClick={addCoordinators}
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
          type="button"
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-700 duration-500 text-white font-bold px-2 text-2xl ml-auto rounded"
        >
          Create Event
        </button>
      </div>
      <div className="text-red-500 mt-2 font-mono">
        {errorText && <p>{errorText}</p>}
      </div>
    </div>
  );
}
