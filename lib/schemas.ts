import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "Too Short!"),
  email: z.email("Invalid email"),
  address: z.string().optional(),
});

export type CreateUser = z.infer<typeof createUserSchema>;
