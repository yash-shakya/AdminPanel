// create Guest lecture config
export const createGuestLecture = {
  title: "Add guest lecture",
  fields: [
    {
      name: "name",
      label: "Guest name",
      type: "text",
    },
    {
      name: "image",
      label: "Guest image",
      type: "file" as const,
    },
    {
      name: "date",
      label: "Date",
      type: "date",
    },
    {
      name: "time",
      label: "Time",
      type: "time",
    },
    {
      name: "desc",
      label: "Description",
      type: "text",
    },
    {
      name: "facebook",
      label: "Facebook link",
      type: "text",
    },
    {
      name: "insta",
      label: "Instagram link",
      type: "text",
    },
    {
      name: "linkedin",
      label: "Linkedin link",
      type: "text",
    },
    {
      name: "link",
      label: "Additional link",
      type: "text",
      required: false,
    },
  ],
  submitText: "Click to save",
};
