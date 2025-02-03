"use client";

import { useEffect, useState } from "react";
import { BaseForm } from "../base_form";
import { createSponsorFormConfig } from "@/app/constants/sponsor";
import { updateSponsor, getSponsorById } from "@/app/actions/sponsors";
// import { getSponsorById, updateSponsor } from "@/app/actions/sponsor";

interface FormState {
  category: string;
  name: string;
  alt?: string;
  targetUrl: string;
  image?: File | null;
  imageUrl?: string;
}

interface UpdateSponsorFormProps {
  id: string;
  category: string;
}

export default function UpdateSponsorForm({
  id,
  category,
}: UpdateSponsorFormProps) {
  const [form, setForm] = useState<FormState | null>(null);
  const [errorText, setErrorText] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSponsorData = async () => {
      try {
        const sponsor = await getSponsorById(id, category);
        setForm({
          category: decodeURIComponent(category),
          name: sponsor.name || "",
          alt: sponsor.alt || "",
          targetUrl: sponsor.targetUrl || "",
          image: null, // Assuming file upload handling is separate
        });
      } catch (error) {
        console.error("Error fetching sponsor data:", error);
        setErrorText("Failed to load sponsor data.");
      }
    };

    fetchSponsorData();
  }, [id, category]);

  const handleFormChange = (updatedForm: FormState) => {
    setForm(updatedForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!form) {
      setErrorText("Form data is missing.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateSponsor(id, category, form);
      alert("Sponsor updated successfully!");
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error updating sponsor:", error);
      setErrorText("An error occurred while updating the sponsor.");
      setIsSubmitting(false);
    }
  };

  if (!form) {
    return <div>Loading...</div>;
  }

  return (
    <div className="update-form">
      <h1 className="text-2xl font-bold mb-4">Update Sponsor</h1>
      <BaseForm
        {...createSponsorFormConfig}
        fields={createSponsorFormConfig.fields.map((field) => ({
          ...field,
          value: form[field.name as keyof FormState] || ("" as any),
        }))}
        submit={handleFormChange}
      />
      <div className="mt-4 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-4 py-2 rounded text-white font-bold ${
            isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Update"}
        </button>
        {errorText && <p className="text-red-500">{errorText}</p>}
      </div>
    </div>
  );
}
