import z from "zod";

export const logCreateModel = z.object({
  message: z.string(),
  level: z.enum(["info", "warn", "error", "debug"]),
});