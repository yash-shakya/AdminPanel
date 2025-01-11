export const createSponsorFormConfig = {
  title: "Create Techspardha Team",
  fields: [
    {
      name: "name",
      label: "Sponsor name",
      type: "text" as const,
    },
    {
      name: "alt",
      label: "Alternate name",
      type: "text" as const,
    },
    {
      name: "targetUrl",
      label: "Link to their site/image",
      type: "text" as const,
    },
    {
      name: "image",
      label: "Sponsor image",
      type: "file" as const,
    },
  ],
  submitText: "Add Sponsor",
};
