import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(3, "Too Short!"),
  description: z.string().min(3, "Too Short!"),
});

export type CreateTask = z.infer<typeof createTaskSchema>;

export const signupSchema = z.object({
  name: z.string().min(3, "Too Short!"),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Too Short!"),
});

export type Signup = z.infer<typeof signupSchema>;
