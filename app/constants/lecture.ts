// create Guest lecture config
export const createGuestLecture = {
  title: "Add guest lecture",
  fields: [
    {
      name: "name",
      label: "Guest name",
      type: "text" as const,
    },
    {
      name: "image",
      label: "Guest image",
      type: "file" as const,
      required: false,
    },
    {
      name: "date",
      label: "Date",
      type: "date" as const,
    },
    {
      name: "time",
      label: "Time",
      type: "time" as const,
    },
    {
      name: "desc",
      label: "Description",
      type: "text" as const,
    },
    {
      name: "facebook",
      label: "Facebook link",
      type: "text" as const,
      required: false,
    },
    {
      name: "insta",
      label: "Instagram link",
      type: "text" as const,
      required: false,
    },
    {
      name: "linkedin",
      label: "Linkedin link",
      type: "text" as const,
      required: false,
    },
    {
      name: "link",
      label: "Additional link",
      type: "text" as const,
      required: false,
    },
  ],
  submitText: "Click to save",
};
