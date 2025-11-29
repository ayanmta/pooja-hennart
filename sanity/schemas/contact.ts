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
  ],
  preview: {
    select: {
      title: "whatsappNumber",
      subtitle: "email",
    },
  },
});

