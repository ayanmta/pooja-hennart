import { defineField, defineType } from "sanity";

export default defineType({
  name: "editorial",
  title: "Editorial Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Title of the editorial project (e.g., 'Mittu SS19', 'Wind & Scarves')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      description: "Publication or project date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Project description (e.g., 'Maquillaje y fotografía editorial para la marca colombiana/española Mittu.')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      description: "Main horizontal image for the editorial card",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Important for accessibility",
        },
      ],
    }),
    defineField({
      name: "galleryLink",
      title: "Gallery Link",
      type: "string",
      description: "Optional link to view full gallery (e.g., 'Ver Album')",
    }),
    defineField({
      name: "galleryLinkText",
      title: "Gallery Link Text",
      type: "string",
      description: "Text for the gallery link (default: 'Ver Album')",
      initialValue: "Ver Album",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first (optional)",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "date",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled Editorial",
        subtitle: subtitle ? new Date(subtitle).toLocaleDateString() : "",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Date (Newest First)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Date (Oldest First)",
      name: "dateAsc",
      by: [{ field: "date", direction: "asc" }],
    },
    {
      title: "Order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});

