"use client";

import { useState } from "react";
import { BaseForm } from "../base_form";
import { createNotification } from "@/app/actions/notification";
import { createNotificationConfig } from "@/app/constants/notification";
import { IMGBB } from "@/app/helpers/imgbb";

interface FormState {
  android_channel_id: string;
  body: string;
  image?: string;
  imageFile: File | null; // not needed in form
  link: string;
  title: string;
  time: number; // Epoch time in milliseconds
}

export default function CreateForm() {
  const [forms, setForms] = useState<FormState[]>([{} as any]); // Array of forms
  const [errorText, setErrorText] = useState<string>("");

  const handleData = (index: number, data: FormState) => {
    const updatedForms = [...forms];
    updatedForms[index] = data;
    setForms(updatedForms);
  };

  const addNewForm = () => {
    setForms([...forms, {} as any]); // Add a new empty form
  };

  const removeNewForm = () => {
    if (forms.length === 1) {
      setErrorText("At least one form is required.");
      // After 2 seconds, remove the error message
      setTimeout(() => setErrorText(""), 2000);
      return;
    }
    setForms(forms.slice(0, forms.length - 1)); // Remove the last form
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
        await createNotification(form); // Submit each form
      }
      setForms([{} as any]); // Reset forms
      setErrorText("");
      alert("notifications Created Successfully");
    } catch (error) {
      console.error("Error creating notification: ", error);
      setErrorText("An error occurred while creating the notification");
    }
  };

  return (
    <div className="create-form">
      {forms.map((form, index) => (
        <div key={index} className="mb-4">
          <BaseForm
            {...createNotificationConfig}
            submit={(data: FormState) => handleData(index, data)}
          />
        </div>
      ))}
      <div className="flex items-center mt-4 gap-5">
        <button
          onClick={addNewForm}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 text-3xl rounded-full"
        >
          +
        </button>
        <button
          onClick={removeNewForm}
          className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 text-3xl rounded-full"
        >
          -
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
