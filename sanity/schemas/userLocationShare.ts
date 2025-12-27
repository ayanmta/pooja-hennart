import { defineField, defineType } from "sanity";

export default defineType({
  name: "userLocationShare",
  title: "User Location Shares",
  type: "document",
  description: "Locations shared by users to help Pooja reach them",
  fields: [
    defineField({
      name: "userLatitude",
      title: "User Latitude",
      type: "number",
      description: "User's latitude coordinate",
      validation: (Rule) => Rule.required().min(-90).max(90),
    }),
    defineField({
      name: "userLongitude",
      title: "User Longitude",
      type: "number",
      description: "User's longitude coordinate",
      validation: (Rule) => Rule.required().min(-180).max(180),
    }),
    defineField({
      name: "distanceKm",
      title: "Distance (km)",
      type: "number",
      description: "Distance from Pooja's location in kilometers",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "travelTimeMinutes",
      title: "Travel Time (minutes)",
      type: "number",
      description: "Estimated travel time in minutes",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "userName",
      title: "User Name",
      type: "string",
      description: "Optional: Name provided by user",
    }),
    defineField({
      name: "userPhone",
      title: "User Phone",
      type: "string",
      description: "Optional: Phone number provided by user",
    }),
    defineField({
      name: "sharedAt",
      title: "Shared At",
      type: "datetime",
      description: "When the location was shared",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      name: "userName",
      phone: "userPhone",
      distance: "distanceKm",
      time: "travelTimeMinutes",
      date: "sharedAt",
    },
    prepare({ name, phone, distance, time, date }) {
      const displayName = name || "Anonymous";
      const displayPhone = phone || "No phone";
      const formattedDate = date ? new Date(date).toLocaleDateString() : "Unknown";
      return {
        title: `${displayName} - ${distance?.toFixed(1)} km`,
        subtitle: `${displayPhone} • ${time} min • ${formattedDate}`,
      };
    },
  },
  orderings: [
    {
      title: "Date (newest first)",
      name: "dateDesc",
      by: [{ field: "sharedAt", direction: "desc" }],
    },
    {
      title: "Date (oldest first)",
      name: "dateAsc",
      by: [{ field: "sharedAt", direction: "asc" }],
    },
    {
      title: "Distance (closest first)",
      name: "distanceAsc",
      by: [{ field: "distanceKm", direction: "asc" }],
    },
    {
      title: "Distance (farthest first)",
      name: "distanceDesc",
      by: [{ field: "distanceKm", direction: "desc" }],
    },
  ],
});
