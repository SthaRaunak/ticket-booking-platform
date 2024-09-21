import z from "zod";

export const registerUserSchema = z.object({
  firstname: z.string().trim().min(1, "Firstname is required"),
  lastname: z.string().trim().min(1, "Lastname is required"),
  email: z.string().email("Invalid Email"),
  password: z.string().min(6, "Password must be 6 characters long"),
});

export type RegisterUser = z.infer<typeof registerUserSchema>;
