export const EVENT_CATEGORIES: string[] = [
  "Programming",
  "Astronomy",
  "Design",
  "Informals",
  "Managerial",
  "Online-events",
  "Robotics",
  "Quizzes",
  "Papyrus-vitae",
];

export const createEventFormConfig = {
  title: "Create Event",
  fields: [
    {
      name: "eventName",
      label: "Event Name",
      type: "text" as const,
      placeholder: "Enter event name",
    },
    {
      name: "description",
      label: "Event Description",
      type: "textarea" as const,
      placeholder: "Describe the event",
    },
    {
      name: "document",
      label: "WhatsApp Group Link",
      type: "text" as const,
      placeholder: "WhatsApp link",
    },
    {
      name: "eventCategory",
      label: "Event Category",
      type: "select" as const,
      options: EVENT_CATEGORIES,
      placeholder: "Select the category",
    },

    {
      name: "image",
      label: "Event Poster",
      type: "file" as const,
    },
    {
      name: "startTime",
      label: "Event start time",
      type: "datetime-local" as const,
    },
    {
      name: "endTime",
      label: "Event end time",
      type: "datetime-local" as const,
    },
    {
      name: "venue",
      label: "Event venue",
      type: "text" as const,
    },
    {
      name: "flagship",
      label: "Flagship event?",
      type: "select" as const,
      options: ["No", "Yes"],
      placeholder: "Is this a flagship event?",
    },
    
    {
      name: "rules",
      label: "Rules (Rule 1 | Rule 2 | Rule 3)",
      type: "textarea" as const,
      description: "Separate rules with '|'",
    },
  ],
  submitText: "Save Event",
};

export const addCoordinatorFormConfig = {
  title: "Add a coordinator",
  fields: [
    {
      name: "coordinator_name",
      label: "Coordinator name",
      type: "text" as const,
    },
    {
      name: "coordinator_number",
      label: "Coordinator number",
      type: "text" as const,
    },
  ],
  submitText: "Save coordinator",
};
