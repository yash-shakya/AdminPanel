"use client";
import { useState } from "react";
import { BaseForm } from "../base_form";
import { createEventCategory } from "@/app/actions/eventCategory";
import { createEventCategoryConfig } from "@/app/constants/eventCategory";

interface FormState {
  eventCategory: string;
  image: File;
}

export default function CreateForm() {
  const [forms, setForms] = useState<FormState[]>([{} as FormState]);
  const [errorText, setErrorText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);

  const handleData = (index: number, data: FormState) => {
    const updatedForms = [...forms];
    updatedForms[index] = data;
    setForms(updatedForms);
  };

  const addNewForm = () => {
    setForms([...forms, {} as FormState]);
    setProgress([...progress, ""]);
  };

  const removeNewForm = () => {
    if (forms.length === 1) {
      setErrorText("At least one form is required.");
      setTimeout(() => setErrorText(""), 2000);
      return;
    }
    setForms(forms.slice(0, -1));
    setProgress(progress.slice(0, -1));
  };

  const updateProgress = (index: number, message: string) => {
    setProgress((prev) => {
      const updatedProgress = [...prev];
      updatedProgress[index] = message;
      return updatedProgress;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorText("");
    setProgress(new Array(forms.length).fill(""));

    try {
      forms.forEach((form, index) => {
        if (!form.eventCategory?.trim()) {
          throw new Error(`Form ${index + 1}: Event category is required.`);
        }
        if (!form.image) {
          throw new Error(`Form ${index + 1}: Image file is required.`);
        }
      });
      for (let i = 0; i < forms.length; i++) {
        const form = forms[i];
        try {
          updateProgress(i, "Submitting...");
          await createEventCategory({
            eventCategory: form.eventCategory,
            image: form.image,
          });
          updateProgress(i, "✓ Successfully submitted.");
        } catch (error) {
          updateProgress(
            i,
            `✗ Failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          );
          throw error;
        }
      }

      setForms([{} as FormState]);
      alert("All categories created successfully.");
    } catch (error) {
      console.error("Error creating event categories:", error);
      setErrorText(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-form">
      {forms.map((form, index) => (
        <div key={index} className="mb-4">
          <BaseForm
            {...createEventCategoryConfig}
            submit={(data: FormState) => handleData(index, data)}
          />
          {progress[index] && (
            <div
              className={`mt-2 p-2 rounded ${
                progress[index].startsWith("✓")
                  ? "bg-green-100 text-green-800"
                  : progress[index].startsWith("✗")
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
              }`}
            >
              {progress[index]}
            </div>
          )}
        </div>
      ))}
      <div className="flex items-center mt-4 gap-5">
        <button
          onClick={addNewForm}
          disabled={isSubmitting}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-2 text-3xl rounded-full disabled:opacity-50"
        >
          +
        </button>
        <button
          onClick={removeNewForm}
          disabled={isSubmitting}
          className="bg-red-500 hover:bg-red-700 text-white font-bold px-3 text-3xl rounded-full disabled:opacity-50"
        >
          -
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-500 hover:bg-green-700 duration-500 text-white font-bold px-2 text-2xl rounded disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      {errorText && (
        <div className="text-red-500 mt-2 font-mono bg-red-50 p-3 rounded border border-red-200">
          {errorText}
        </div>
      )}
    </div>
  );
}
