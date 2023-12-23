import { z } from "zod";

export const CreateApplicationModel = z.object({
  name: z.string().min(3).max(20),
})