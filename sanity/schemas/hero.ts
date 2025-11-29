import { defineField, defineType } from "sanity";

export default defineType({
  name: "hero",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Main heading (e.g., 'POOJA')",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "Subheading text (e.g., 'HennArt & Makeover')",
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image (Single)",
      type: "image",
      description: "Single full-screen hero background image (legacy - use heroImages array for carousel)",
      options: {
        hotspot: true,
      },
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
      name: "heroImages",
      title: "Hero Images (Carousel)",
      type: "array",
      description: "Multiple images for hero carousel - will fade/slide automatically",
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative Text",
              description: "Important for accessibility",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).max(10),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "Location text (e.g., 'Barcelona', 'Mumbai')",
    }),
    defineField({
      name: "carouselAutoPlay",
      title: "Auto-play Carousel",
      type: "boolean",
      description: "Automatically transition between images",
      initialValue: true,
    }),
    defineField({
      name: "carouselInterval",
      title: "Carousel Interval (seconds)",
      type: "number",
      description: "Time between image transitions",
      initialValue: 5,
      validation: (Rule) => Rule.min(3).max(10),
    }),
    defineField({
      name: "showScrollCue",
      title: "Show Scroll Indicator",
      type: "boolean",
      description: "Display scroll down indicator",
      initialValue: true,
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Site logo (will appear in header and hero section)",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text",
          description: "Logo alt text for accessibility",
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      media: "backgroundImage",
    },
  },
});

