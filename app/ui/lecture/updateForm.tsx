"use client";

import { useEffect, useState } from "react";
import { BaseForm } from "../base_form";
import { createGuestLectureConfig } from "@/app/constants/lecture";
import { getLectureById, updateLecture } from "@/app/actions/lecture";

interface FormState {
    date: string;
    desc: string;
    facebook?: string;
    insta?: string;
    linkedin?: string;
    link?: string;
    name: string;
    time: string;
    image?: File | null;
}

interface UpdateLectureFormProps {
    id: string;
}

export default function UpdateLectureForm({ id }: UpdateLectureFormProps) {
    const [form, setForm] = useState<FormState | null>(null);
    const [errorText, setErrorText] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchLectureData = async () => {
            try {
                const lecture = await getLectureById(id);
                setForm({
                    date: lecture.date || "",
                    desc: lecture.desc || "",
                    facebook: lecture.facebook || "",
                    insta: lecture.insta || "",
                    linkedin: lecture.linkedin || "",
                    link: lecture.link || "",
                    name: lecture.name || "",
                    time: lecture.time || "",
                    image: null, // Assuming file upload handling is separate
                });
            } catch (error) {
                console.error("Error fetching lecture data:", error);
                setErrorText("Failed to load lecture data.");
            }
        };

        fetchLectureData();
    }, [id]);

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
            await updateLecture(id, form);
            alert("Lecture updated successfully!");
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error updating lecture:", error);
            setErrorText("An error occurred while updating the lecture.");
            setIsSubmitting(false);
        }
    };

    if (!form) {
        return <div>Loading...</div>;
    }

    return (
        <div className="update-form">
            <h1 className="text-2xl font-bold mb-4">Update Lecture</h1>
            <BaseForm
                {...createGuestLectureConfig}
                fields={createGuestLectureConfig.fields.map((field) => ({
                    ...field,
                    value : form[field.name as keyof FormState] || "" as any,
                }))}
                submit={handleFormChange}
            />
            <div className="mt-4 flex items-center gap-4">
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-4 py-2 rounded text-white font-bold ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
                        }`}
                >
                    {isSubmitting ? "Submitting..." : "Update"}
                </button>
                {errorText && <p className="text-red-500">{errorText}</p>}
            </div>
        </div>
    );
}
