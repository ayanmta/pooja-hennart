import { defineField, defineType } from "sanity";

export default defineType({
  name: "about",
  title: "About Section",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Full name to display",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Profile or about image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
        },
      ],
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "text",
      description: "Short bio (2-3 lines recommended)",
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: "expertise",
      title: "Expertise Areas",
      type: "array",
      of: [{ type: "string" }],
      description: "List of expertise areas (e.g., 'Bridal Makeup', 'Mehendi Art')",
      options: {
        layout: "tags",
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
    },
  },
});

