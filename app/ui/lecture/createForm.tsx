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

  const addNewForm = () => {
    setForms([...forms, {}]); // Add a new empty form
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error_message = "";

    // Validate each form
    for (const form of forms) {
      if (Object.keys(form).length === 0) {
        error_message = "Please fill all forms.";
        break;
      }
    }

    if (error_message) {
      setErrorText(error_message);
      return;
    }

    try {
      for (const form of forms) {
        await createLecture(form as any); // Submit each form
      }
      setForms([{}]); // Reset forms
      setErrorText("");
      alert("Lectures Created Successfully");
    } catch (error) {
      console.error("Error creating lectures: ", error);
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
      <div className="flex items-center mt-4">
        <button
          type="button"
          onClick={addNewForm}
          className="bg-blue-500 hover:bg-blue-700 duration-500 text-white font-bold px-2 text-2xl rounded mr-4"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-700 duration-500 text-white font-bold px-2 text-2xl rounded"
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
