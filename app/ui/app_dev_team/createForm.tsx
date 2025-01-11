"use client";

import { createDevTeamFormConfig } from "@/app/constants/dev_team";
import { BaseForm } from "../base_form";
import createImgbbUrl, { IMGBB } from "@/app/helpers/imgbb";
import { DevTeamMember } from "@/app/actions/dev_team";
import { addDevTeamMember } from "@/app/actions/app_dev_team";

export default function CreateDevForm() {
    const handleSubmit = async (data: DevTeamMember) => {
        try {
            if (!data.image) {
                throw new Error("No image provided");
            }

            // Generate image URL using imgbb
            const imgbb: IMGBB | null = await createImgbbUrl(data.image);

            // Remove the local image from the data
            delete data.image;
            // Add the new dev team member
            await addDevTeamMember({
                ...data,
                imageUrl: imgbb || null,
            });
            window.location.reload(); // TODO: Not a good practice
        } catch (error) {
            console.error("Error adding dev team member:", error);
        }
    };

    return (
        <div className="create-form">
            <BaseForm {...createDevTeamFormConfig} submit={handleSubmit} />
        </div>
    );
}
