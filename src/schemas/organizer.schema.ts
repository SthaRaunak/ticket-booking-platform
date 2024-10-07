import z from "zod";

export const makeOrganizerSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  about: z.string().trim().min(1, "About is required"),
  email: z.string().email("Invalid Email"),
  phone: z.string().trim().min(1, "Phone Number is required"),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
});

export const updateOrganizerSchema = makeOrganizerSchema.partial();
