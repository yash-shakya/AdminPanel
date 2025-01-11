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
        name: "eventDescription",
        label: "Event Description",
        type: "textarea" as const, 
        placeholder: "Describe the event",
      },
      {
        name: "eventDocument",
        label: "WhatsApp Group Link",
        type: "textarea" as const, 
        placeholder: "WhatsApp link",
      },
      {
        name: "eventStartDate",
        label: "Start Date",
        type: "text" as const, 
        placeholder: "Enter start date",
      },
      {
        name: "eventEndDate",
        label: "End Date",
        type: "text" as const, 
        placeholder: "Enter end date",
      },
      {
        name: "eventBanner",
        label: "Event Banner",
        type: "file" as const, 
      },
      {
        name: "eventVenue",
        label: "Venue",
        type: "text" as const, 
      },
     
    ],
    submitText: "Create Event",
  };
  