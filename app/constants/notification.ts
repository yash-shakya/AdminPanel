// create Guest lecture config
export const createNotificationConfig = {
  title: "Add a new notification",
  fields: [
    {
      name: "title",
      label: "Title of notification",
      type: "text" as const,
    },
    {
      name: "body",
      label: "Description",
      type: "text" as const,
    },
    {
      name: "image",
      label: "Notification image",
      type: "file" as const,
    },
    {
      name: "time",
      label: "Time",
      type: "datetime" as const,
    },
    {
      name: "android_channel_id",
      label: "Your society/club name",
      type: "text" as const,
    },
    {
      name: "link",
      label: "Link",
      type: "text" as const,
    },
  ],
  submitText: "Click to save",
};
