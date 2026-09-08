// CounterUpdateForm.schema.ts
import { z } from "zod";

export const counterUpdateFormSchema = z.object({
  id_counter: z.number().min(0, "Counter ID is required"),
  amount: z.number().min(0, "Amount must be non-negative"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  auto: z.boolean(),
  comment: z.string().optional(),
});

export type CounterUpdateFormValues = z.infer<typeof counterUpdateFormSchema>;
