export const createAdminFormConfig = {
    title: "Create Admin User",
    fields: [
        {
            name: "email",
            label: "Email",
            type: "email" as const,
            placeholder: "Enter admin email",
        },
        {
            name: "name",
            label: "Full Name",
            type: "text" as const,
            placeholder: "Enter admin name",
        },
        {
            name: "picture",
            label: "Profile Picture",
            type: "file" as const,
        },
        {
            name: "phone",
            label: "Phone Number",
            type: "text" as const,
            placeholder: "Enter phone number",
            required: false,
        },
        {
            name: "college",
            label: "College",
            type: "text" as const,
            placeholder: "Enter college name",
            required: false,
        },
        {
            name: "year",
            label: "Year",
            type: "select" as const,
            options: ["1st", "2nd", "3rd", "4th", "5th"],
            required: false,
        }
    ],
    submitText: "Create Admin",
};