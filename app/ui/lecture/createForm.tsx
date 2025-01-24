"use client";

import { useState } from "react";
import { BaseForm } from "../base_form";
import { createGuestLectureConfig } from "@/app/constants/lecture";
import {
  createLecture,
  getAllLecture,
  updateLecture,
} from "@/app/actions/lecture";

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

export default function CreateForm() {
  const [forms, setForms] = useState<FormState[]>([
    {
      date: "",
      desc: "",
      name: "",
      time: "",
    },
  ]); // Array of forms
  const [errorText, setErrorText] = useState<string>("");

  const handleData = (index: number, data: FormState) => {
    const updatedForms = [...forms];
    updatedForms[index] = data;
    setForms(updatedForms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error_message = "";

    // Take button from the event
    const target = e.target as HTMLButtonElement;
    // Disable the button to prevent multiple clicks and show loading state
    target.disabled = true;
    target.innerText = "Submitting...";

    // Now we have only 1 form in the array forms
    const form = forms[0];

    // Validate each form
    if (Object.keys(form).length === 0) {
      // Check if the form is empty
      error_message = "Please fill all forms.";
    }

    if (error_message) {
      setErrorText(error_message);
      // Reset the button
      target.disabled = false;
      target.innerText = "Submit";
      return;
    }

    try {
      // Now getAll the forms from the DB to check if the form is already exists
      // Get all the lectures
      const lectures = await getAllLecture(); // Returns an array of lectures
      let lectureExists = false;

      // Loop through the lectures
      if (Array.isArray(lectures))
        for (const lecture of lectures) {
          // check if name, date and time are same
          if (
            lecture.name === form.name &&
            lecture.date === form.date &&
            lecture.time === form.time
          ) {
            // If the lecture already exists, update it
            if (lecture.id) {
              await updateLecture(lecture.id, form);
            } else {
              throw new Error("Lecture ID is undefined");
            }
            lectureExists = true;
          }
        }
      if (!lectureExists) {
        // If the lecture does not exist, create a new one
        await createLecture(form);
      }
      setForms([
        {
          date: "",
          desc: "",
          name: "",
          time: "",
        },
      ]); // Reset forms
      setErrorText("");
      target.innerText = "Submitted";
      // Enable the button after 2 seconds
      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
      }, 1000);
      // Reload the page
      window.location.reload(); // TODO: This is a hacky way to reload the page after submitting the form (not recommended)
    } catch (error) {
      console.error("Error creating lectures: ", error);
      // Reset the button
      target.innerText = "Error...";
      target.style.backgroundColor = "red";
      // Enable the button after 2 seconds
      setTimeout(() => {
        target.disabled = false;
        target.style.backgroundColor = "green";
        target.innerText = "Submit";
      }, 1000);
      setErrorText("An error occurred while creating the lectures");
    }
  };

  return (
    <div className="create-form">
      {forms.map((form, index) => (
        <div key={index} className="mb-4">
          <BaseForm
            {...createGuestLectureConfig}
            submit={(data: FormState) => handleData(index, data)}
          />
        </div>
      ))}
      <div className="flex items-center mt-4 gap-5">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-500 ml-auto hover:bg-green-700 duration-500 text-white font-bold px-4 text-2xl rounded"
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
