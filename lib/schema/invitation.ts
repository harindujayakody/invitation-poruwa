import { z } from "zod";

export const eventItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Event title is required"),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  venue: z.string().min(1, "Venue is required"),
  address: z.string().optional(),
  mapUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().optional(),
  sort: z.number().default(0),
});

export const invitationContentSchema = z.object({
  couple: z.object({
    partnerOne: z.string().min(1, "Name is required"),
    partnerTwo: z.string().min(1, "Name is required"),
    partnerOneParents: z.string().optional(),
    partnerTwoParents: z.string().optional(),
  }),
  eventDate: z.string().optional(),
  story: z.object({
    quote: z.string().optional(),
    message: z.string().optional(),
  }).optional(),
  events: z.array(eventItemSchema).default([]),
  sections: z.object({
    showCover: z.boolean().default(true),
    showEvents: z.boolean().default(true),
    showStory: z.boolean().default(true),
    showRsvp: z.boolean().default(true),
    showGifts: z.boolean().default(false),
  }).default({
    showCover: true,
    showEvents: true,
    showStory: true,
    showRsvp: true,
    showGifts: false,
  }),
  themeOverrides: z.object({
    accentColor: z.string().optional(),
    fontPairing: z.string().optional(),
  }).optional(),
});

export type EventItem = z.infer<typeof eventItemSchema>;
export type InvitationContent = z.infer<typeof invitationContentSchema>;
