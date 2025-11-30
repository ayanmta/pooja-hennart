import { defineField, defineType } from "sanity";

export default defineType({
  name: "videoItem",
  title: "Video Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Title for this video",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      description: "Optional: Video thumbnail (will be auto-generated from video URL if not provided)",
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
      name: "platform",
      title: "Platform",
      type: "string",
      options: {
        list: [
          { title: "Instagram Reels", value: "instagram" },
          { title: "YouTube", value: "youtube" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      description: "Full URL to the video (Instagram Reel or YouTube)",
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: "videoId",
      title: "Video ID",
      type: "string",
      description: "For YouTube: video ID only (e.g., 'dQw4w9WgXcQ'). For Instagram: leave empty",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      description: "Video description or caption",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "platform",
      media: "thumbnail",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle === "instagram" ? "📱 Instagram Reel" : "▶️ YouTube",
        media,
      };
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

