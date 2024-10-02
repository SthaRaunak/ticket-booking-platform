import z from "zod";

export const registerUserSchema = z.object({
  firstname: z.string().trim().min(1, "Firstname is required").max(255),
  lastname: z.string().trim().min(1, "Lastname is required").max(255),
  email: z.string().email("Invalid Email").max(255),
  password: z.string().min(6, "Password must be 6 characters long"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid Email").max(255),
  password: z.string().trim().min(1, "Password is required"),
});

export type RegisterUser = z.infer<typeof registerUserSchema>;
