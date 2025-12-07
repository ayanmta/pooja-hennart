import { defineField, defineType } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "id",
      title: "Category ID",
      type: "string",
      description: "Unique identifier (e.g., 'bridal', 'mehendi') - lowercase, no spaces",
      validation: (Rule) =>
        Rule.required()
          .lowercase()
          .regex(/^[a-z0-9-]+$/, {
            name: "category-id",
            invert: false,
          })
          .error("Must be lowercase letters, numbers, and hyphens only"),
    }),
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      description: "Display name (e.g., 'Bridal', 'Mehendi')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 0,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Short description for the category (shown on category cards)",
      rows: 2,
      validation: (Rule) => Rule.max(120).warning("Keep descriptions short for best display"),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "id",
    },
  },
  orderings: [
    {
      title: "Order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});

