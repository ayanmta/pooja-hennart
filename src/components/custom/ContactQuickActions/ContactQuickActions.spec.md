# ContactQuickActions Component Specification

## Overview
A contact section with primary CTA (WhatsApp) and secondary actions (Call, Instagram, Email). Optional short booking form.

## Props
- `whatsappNumber` (string, required): WhatsApp phone number (with country code, e.g., "+919876543210")
- `phoneNumber` (string, optional): Phone number for call
- `instagramHandle` (string, optional): Instagram username (without @)
- `email` (string, optional): Email address
- `showBookingForm` (boolean, optional): Show booking form. Default: false

## Visual Design
- Primary WhatsApp button (large, prominent)
- Secondary action buttons (Call, Instagram, Email)
- Optional booking form below actions
- Centered layout
- Mobile-first responsive

## States
- Default: Shows all contact actions
- Form: Shows booking form if enabled

## Accessibility
- Semantic buttons with proper labels
- ARIA attributes for external links
- Form accessibility (if form is shown)

## Usage
```tsx
<ContactQuickActions 
  whatsappNumber="+919876543210"
  phoneNumber="+919876543210"
  instagramHandle="poojahennart"
  email="hello@poojahennart.com"
  showBookingForm={false}
/>
```

## Constraints
- Must use Button component from shadcn/ui
- Must use theme tokens only
- Mobile-first design
- No inline styles

