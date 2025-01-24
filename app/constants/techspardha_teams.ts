// Constant Teams for Techspardha
import { Post } from "@/app/actions/techspardha_teams";

export const TECHSPARDHA_TEAMS: string[] = [
  "Technobyte",
  "EMR",
  "Aeromodeling",
  "Mexperts",
  "Startup Cell",
  "Innovation Cell",
  "Microbus",
  "Antariksh",
  "Mechsoc",
  "Electroreck",
  "Infrastucture",
];

// Create Team Form Config
export const createTeamFormConfig = {
  title: "Create Techspardha Team",
  fields: [
    {
      name: "teamName",
      label: "Team Name",
      type: "select" as const,
      options: TECHSPARDHA_TEAMS,
    },
    {
      name: "teamLogo",
      label: "Team Logo",
      type: "file" as const,
    },
  ],
  submitText: "Create Team",
};

// Add more contact fields if needed
// Config for adding more contacts
export const addContactFormConfig = {
  title: "Add a Contact",
  fields: [
    {
      name: "contactName",
      label: "Contact Name",
      type: "text" as const,
      placeholder: "Enter the name of the contact",
    },
    {
      name: "contactPost",
      label: "Contact Post",
      type: "select" as const,
      options: Object.values(Post),
    },
    {
      name: "contactImage",
      label: "Contact Image",
      type: "file" as const,
    },
  ],
  submitText: "Save Contact",
};

// Edit Team Form Config
export const editTeamFormConfig = {
  title: "Edit Techspardha Team",
  fields: [
    {
      name: "teamName",
      label: "Team Name",
      type: "select" as const,
      options: TECHSPARDHA_TEAMS,
    },
    {
      name: "teamLogo",
      label: "Team Logo",
      type: "file" as const,
    },
    {
      name: "contact1Name",
      label: "Contact 1 Name",
      type: "text" as const,
      placeholder: "Enter the name of the first contact",
    },
    {
      name: "contact1Post",
      label: "Contact 1 Post",
      type: "select" as const,
      options: Object.values(Post),
    },
    {
      name: "contact1Image",
      label: "Contact 1 Image",
      type: "file" as const,
    },
    {
      name: "contact2Name",
      label: "Contact 2 Name",
      type: "text" as const,
      placeholder: "Enter the name of the second contact",
    },
    {
      name: "contact2Post",
      label: "Contact 2 Post",
      type: "select" as const,
      options: Object.values(Post),
    },
    {
      name: "contact2Image",
      label: "Contact 2 Image",
      type: "file" as const,
    },
  ],
  submitText: "Edit Team",
};
