"use client"
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BaseForm } from "@/app/ui/base_form";
import { getUserByEmail, updateUser } from "@/app/actions/users";
import { User } from "@/app/actions/users";

type FieldType = "text" | "email" | "number" | "select" | "textarea" | "time" | "file" | "password" | "date" | "datetime-local" | "checkbox";

const EditUserPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    const decodedEmail = decodeURIComponent(id as string);
                    const userData = await getUserByEmail(decodedEmail);
                    setUser(userData);
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            })();
        }
    }, [id]);

    const handleSubmit = async (updatedData: Partial<User>) => {
        if (!id) return;

        try {
            await updateUser(id as string, updatedData);
            alert("User updated successfully!");
            router.push("/panel/view/admins");
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    const fields = [
        { name: "name", label: "Name", type: "text" as FieldType, value: user.name, required: true },
        { name: "email", label: "Email", type: "email" as FieldType, value: user.email, required: true },
        { name: "role", label: "Role", type: "text" as FieldType, value: user.role || "" },
        { name: "college", label: "College", type: "text" as FieldType, value: user.college || "" },
        { name: "phone", label: "Phone", type: "text" as FieldType, value: user.phone || "" },
        { name: "year", label: "Year", type: "text" as FieldType, value: user.year ? user.year.toString() : "" },
    ];

    return (
        <div>
            <h1>Edit User</h1>
            <BaseForm
                title="Edit User Details"
                fields={fields}
                submit={handleSubmit}
                submitText="Update"
            />
        </div>
    );
};

export default EditUserPage;
