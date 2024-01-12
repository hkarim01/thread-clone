import * as z from "zod";

export const MessageValidation = z.object({
  content: z.string().min(1, { message: "Minimum 1 character" }),
});
