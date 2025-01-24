"use client";

import { useState } from "react";
import { BaseForm } from "../base_form";
import { createAdminFormConfig } from "@/app/constants/admin_users";
import { createUser, type User } from "@/app/actions/users";
import createImgbbUrl from "@/app/helpers/imgbb";

interface FormState {
  email?: string;
  name?: string;
  picture?: File;
  phone?: string;
  college?: string;
  year?: string;
}

export default function CreateAdminForm() {
  const [form, setForm] = useState<FormState>({});
  const [errorText, setErrorText] = useState<string>("");

  const handleCreateAdmin = (data: FormState) => {
    setForm(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let error_message = "";

    const target = e.target as HTMLButtonElement;
    target.disabled = true;
    target.innerText = "Submitting...";

    if (!form.email || !form.name || !form.picture) {
      error_message = "Please fill all required fields";
    }

    if (error_message) {
      setErrorText(error_message);
      target.disabled = false;
      target.innerText = "Submit";
      return;
    }

    try {
      const pictureResult = await createImgbbUrl(form.picture!);
      if (!pictureResult?.url) {
        throw new Error("Failed to upload profile picture");
      }

      const adminData: User = {
        email: form.email!,
        name: form.name!,
        picture: pictureResult.url,
        phone: form.phone || "",
        college: form.college || "",
        year: form.year || "",
        admin: true,
        role: "admin",
        onBoard: true,
      };

      await createUser(form.email!, adminData);

      setForm({});
      setErrorText("");
      target.innerText = "Submitted";

      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
      }, 1000);

      window.location.reload();
    } catch (error) {
      console.error("Error creating admin:", error);
      target.innerText = "Error...";
      target.style.backgroundColor = "red";

      setTimeout(() => {
        target.disabled = false;
        target.innerText = "Submit";
      }, 1000);

      setErrorText("An error occurred while creating the admin user");
    }
  };

  return (
    <div className="create-form">
      <BaseForm {...createAdminFormConfig} submit={handleCreateAdmin} />
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-700 duration-500 text-white font-bold px-2 text-2xl ml-auto rounded"
        >
          Create Admin
        </button>
      </div>
      <div className="text-red-500 mt-2 font-mono">
        {errorText && <p>{errorText}</p>}
      </div>
    </div>
  );
}
