export const createSponsorFormConfig = {
  title: "Create Techspardha Team",
  fields: [
    {
      name: "name",
      label: "Sponsor name",
      type: "text",
    },
    {
      name: "alt",
      label: "Alternate name",
      type: "text",
    },
    {
      name: "targetUrl",
      label: "Link to their site/image",
      type: "text",
    },
    {
      name: "image",
      label: "Sponsor image",
      type: "file" as const,
    },
  ],
  submitText: "Add Sponsor",
};
