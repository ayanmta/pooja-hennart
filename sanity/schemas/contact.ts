import { defineField, defineType } from "sanity";

export default defineType({
  name: "contact",
  title: "Contact Information",
  type: "document",
  fields: [
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number",
      type: "string",
      description: "Phone number with country code (e.g., +919876543210)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "whatsappMessage",
      title: "Default WhatsApp Message",
      type: "text",
      description: "Pre-filled message for WhatsApp (optional)",
      rows: 3,
    }),
    defineField({
      name: "phoneNumber",
      title: "Phone Number",
      type: "string",
      description: "Phone number for calls (optional)",
    }),
    defineField({
      name: "instagramHandle",
      title: "Instagram Handle",
      type: "string",
      description: "Instagram username without @ (e.g., 'poojahennart')",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook Page URL",
      type: "url",
      description: "Full URL to Facebook page (e.g., https://facebook.com/poojahennart)",
    }),
    defineField({
      name: "youtubeChannelUrl",
      title: "YouTube Channel URL",
      type: "url",
      description: "Full URL to YouTube channel (e.g., https://youtube.com/@poojahennart)",
    }),
    defineField({
      name: "email",
      title: "Email Address",
      type: "email",
      description: "Contact email address",
    }),
    defineField({
      name: "showBookingForm",
      title: "Show Booking Form",
      type: "boolean",
      description: "Display booking form in contact section",
      initialValue: false,
    }),
    defineField({
      name: "contactTitle",
      title: "Contact Section Title",
      type: "string",
      description: "Title for contact section (e.g., 'Get in Touch')",
      initialValue: "Get in Touch",
    }),
    defineField({
      name: "contactSubtitle",
      title: "Contact Section Subtitle",
      type: "string",
      description: "Subtitle for contact section",
    }),
  ],
  preview: {
    select: {
      title: "whatsappNumber",
      subtitle: "email",
    },
  },
});

