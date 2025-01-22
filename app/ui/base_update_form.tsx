"use client";

import Image from "next/image";
import { getImgbbUrl } from "@/app/helpers/imgbb";
import { TechspardhaTeam, Post } from "@/app/actions/techspardha_teams";

interface BaseUpdateFormProps {
    index: number;
    contact: TechspardhaTeam["contacts"][0];
    onUpdate: (index: number, updatedContact: Partial<TechspardhaTeam["contacts"][0]>) => void;
    onDelete: (index: number) => void;
}

const BaseUpdateForm = ({ index, contact, onUpdate, onDelete }: BaseUpdateFormProps) => {
    return (
        <div className="flex flex-col gap-5 mb-5 border p-4 rounded">
            <h2 className="text-xl font-semibold">Contact {index + 1}</h2>
            <div className="flex items-center gap-5">
                <Image
                    src={contact.imageURL || "/placeholder.png"}
                    alt={`Contact ${index + 1} Image`}
                    width={100}
                    height={100}
                    className="rounded-full border"
                />
                <label htmlFor={`contact-image-${index}`} className="cursor-pointer">
                    <input
                        type="file"
                        id={`contact-image-${index}`}
                        className="text-black"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                getImgbbUrl(file).then((url) => {
                                    if (url) {
                                        onUpdate(index, { imageURL: url.imageURL?.url || "" });
                                    }
                                });
                            }
                        }}
                    />
                    <span className="text-blue-500 underline text-md">Change Image</span>
                </label>
            </div>
            <label className="flex flex-col">
                <span className="font-medium">Contact Name</span>
                <input
                    type="text"
                    value={contact.name}
                    onChange={(e) => onUpdate(index, { name: e.target.value })}
                    className="border rounded px-2 py-1 text-black"
                />
            </label>
            <label className="flex flex-col">
                <span className="font-medium">Contact Post</span>
                <select
                    value={contact.post}
                    onChange={(e) => onUpdate(index, { post: e.target.value as Post })}
                    className="border rounded px-2 py-1 text-black"
                >
                    {Object.values(Post).map((postOption) => (
                        <option key={postOption} value={postOption}>
                            {postOption}
                        </option>
                    ))}
                </select>
            </label>
            <button
                className="text-red-500 underline mt-2 self-start"
                onClick={() => onDelete(index)}
            >
                Delete Contact
            </button>
        </div>
    );
};

export default BaseUpdateForm;