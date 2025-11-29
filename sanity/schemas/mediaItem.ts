import { defineField, defineType } from "sanity";

export default defineType({
  name: "mediaItem",
  title: "Media Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Title for this media item",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Main image",
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
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      description: "Optional thumbnail (uses main image if not provided)",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
      description: "Select categories for this media item",
      validation: (Rule) => Rule.min(1).error("Select at least one category"),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      description: "Caption or description for the image",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      description: "Show in featured looks section",
      initialValue: false,
    }),
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram", value: "instagram" },
          { title: "Other", value: "other" },
        ],
      },
      initialValue: "instagram",
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
      subtitle: "caption",
      media: "image",
      featured: "isFeatured",
    },
    prepare({ title, subtitle, media, featured }) {
      return {
        title: title || "Untitled",
        subtitle: featured ? "⭐ Featured" : subtitle || "",
        media,
      };
    },
  },
  orderings: [
    {
      title: "Featured First",
      name: "featuredFirst",
      by: [{ field: "isFeatured", direction: "desc" }, { field: "order", direction: "asc" }],
    },
    {
      title: "Order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});

