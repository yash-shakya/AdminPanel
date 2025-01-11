const YEARS = [
    "Freshman",
    "Sophomore",
    "Pre-Final Year",
    "Final Year",
    "Super Senior",
]

export const createDevTeamFormConfig = {
    title: "Add a member",
    fields: [
      {
        name: "name",
        label: "Developer's name",
        type: "text" as const,
      },
      {
        name: "year",
        label: "Year",
        type: "select" as const,
        options: YEARS,
      },
      {
        name: "linkedin",
        label: "Link to your linkedin profile",
        type: "text" as const,
        required: false,
      },
      {
        name: "insta",
        label: "Link to your instagram profile",
        type: "text" as const,
        required: false,
      },
      {
        name: "github",
        label: "Link to your github profile",
        type: "text" as const,
        required: false,
      },
      {
        name: "image",
        label: "Developer's image",
        type: "file" as const,
      },
    ],
    submitText: "Add Developer",
  };