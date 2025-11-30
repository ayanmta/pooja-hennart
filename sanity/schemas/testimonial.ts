import { defineField, defineType } from "sanity";

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote / Comment",
      type: "text",
      description: "The testimonial text or comment",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
      description: "Name of the person who left the comment",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authorProfilePic",
      title: "Author Profile Picture",
      type: "image",
      description: "Profile picture from YouTube/Instagram (auto-pulled or manual)",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "authorProfilePicUrl",
      title: "Author Profile Picture URL",
      type: "url",
      description: "Direct URL to profile picture (from YouTube/Instagram API)",
    }),
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      description: "Source platform",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Instagram", value: "instagram" },
          { title: "Manual", value: "manual" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "platformId",
      title: "Platform Comment ID",
      type: "string",
      description: "Original comment ID from YouTube/Instagram",
    }),
    defineField({
      name: "videoId",
      title: "Video ID (YouTube)",
      type: "string",
      description: "YouTube video ID if from YouTube",
    }),
    defineField({
      name: "postId",
      title: "Post ID (Instagram)",
      type: "string",
      description: "Instagram post ID if from Instagram",
    }),
    defineField({
      name: "event",
      title: "Event Type",
      type: "string",
      description: "Optional: Type of event (e.g., 'Bridal Makeup', 'Mehendi Ceremony')",
    }),
    defineField({
      name: "likedByMe",
      title: "Liked by Me",
      type: "boolean",
      description: "Whether this comment was liked by you",
      initialValue: false,
    }),
    defineField({
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      description: "Show in testimonials section",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Display order (lower numbers appear first)",
      initialValue: 0,
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      description: "Date of the comment",
    }),
  ],
  preview: {
    select: {
      title: "authorName",
      subtitle: "quote",
      platform: "platform",
      media: "authorProfilePic",
    },
    prepare({ title, subtitle, platform, media }) {
      return {
        title: title || "Anonymous",
        subtitle: subtitle ? `${subtitle.substring(0, 60)}...` : "No quote",
        // Use the actual image media, or omit it if not available
        // Don't use emojis as media - they cause invalid HTML tag errors
        media: media || undefined,
      };
    },
  },
  orderings: [
    {
      title: "Date (Newest)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
    {
      title: "Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});

