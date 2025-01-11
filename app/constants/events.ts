export const EVENT_CATEGORIES: string[] = [
	"Programming",
	"Astronomy",
	"Design",
	"Informals",
	"Managerial",
    "Online-events",
    "Robotics",
    "Quizzes",
    "Papyrus-vitae"

	
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
        name: "eventCategory",
        label: "Event Category",
        type: "select" as const, 
        options: EVENT_CATEGORIES,
        placeholder: "Enter start date",
      },
      
      {
        name: "eventBanner",
        label: "Event Banner",
        type: "file" as const, 
      },
      {
        name: "eventCategoryImg",
        label: "Category Image",
        type: "file" as const, 
      },
     
     
    ],
     submitText: "Save Event",
  };
  