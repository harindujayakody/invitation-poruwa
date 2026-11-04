import { z } from "zod";

export const rsvpInput = z.object({
  token: z.string().min(16).max(64),
  eventId: z.string().uuid(),
  status: z.enum(["accepted", "declined"]),
  headsAttending: z.number().int().min(0).max(20).optional(),
  message: z.string().trim().max(500).optional(),
}).refine(
  (v) => v.status === "declined" || (v.headsAttending ?? 0) >= 1,
  { message: "headsAttending must be at least 1 when accepting", path: ["headsAttending"] },
);

export type RsvpInput = z.infer<typeof rsvpInput>;
