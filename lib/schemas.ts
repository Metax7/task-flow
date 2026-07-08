import { z } from "zod";
import { msg } from "gt-next";

export const createTaskSchema = z.object({
  title: z.string().min(3, msg("Too Short!")),
  description: z.string().min(3, msg("Too Short!")),
});

export type CreateTask = z.infer<typeof createTaskSchema>;

export const signupSchema = z.object({
  name: z.string().min(3, msg("Too Short!")),
  email: z.email(msg("Invalid email")),
  password: z.string().min(8, msg("Too Short!")),
});

export type Signup = z.infer<typeof signupSchema>;
