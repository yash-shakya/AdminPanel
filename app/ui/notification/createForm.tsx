"use client"
import { useState } from "react";
import { BaseForm } from "../base_form";
import { createNotification } from "@/app/actions/notification";
import { createNotificationConfig } from "@/app/constants/notification";
import createImgbbUrl from "@/app/helpers/imgbb";

interface FormState {
  android_channel_id: string;
  body: string;
  imageFile?: File;  // Changed from image to imageFile
  link: string;
  title: string;
  time: string | number; // Updated to handle string time format
}

export default function CreateForm() {
  const [forms, setForms] = useState<FormState[]>([{} as FormState]);
  const [errorText, setErrorText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleData = (index: number, data: FormState) => {
    const updatedForms = [...forms];
    updatedForms[index] = data;
    setForms(updatedForms);
  };

  const addNewForm = () => {
    setForms([...forms, {} as FormState]);
  };

  const removeNewForm = () => {
    if (forms.length === 1) {
      setErrorText("At least one form is required.");
      setTimeout(() => setErrorText(""), 2000);
      return;
    }
    setForms(forms.slice(0, -1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorText("");

    try {
      // Updated validation to check for imageFile instead of image
      const invalidForm = forms.find(form => 
        !form.android_channel_id?.trim() || 
        !form.body?.trim() || 
        !form.imageFile || // Changed from image to imageFile
        !form.link?.trim() || 
        !form.title?.trim() || 
        !form.time
      );

      if (invalidForm) {
        throw new Error("Please fill all required fields in all forms.");
      }

      // Process each form sequentially
      for (const form of forms) {
        try {
          // Pass the File object to createImgbbUrl
          const imageResult = await createImgbbUrl(form.imageFile!);
          
          if (!imageResult?.url) {
            throw new Error("Image upload failed");
          }

          const timestamp = typeof form.time === 'string' 
            ? new Date(form.time).getTime() 
            : form.time;

          await createNotification({
            android_channel_id: form.android_channel_id,
            body: form.body,
            image: imageResult.url,
            link: form.link,
            title: form.title.trim(),
            time: timestamp,
          });
        } catch (error) {
          throw new Error(`Failed to process form: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      setForms([{} as FormState]);
      alert("Notifications Created Successfully");
    } catch (error) {
      console.error("Error creating notification:", error);
      setErrorText(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
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