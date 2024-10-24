import z from "zod";
export const getTrainValidator = z.object({
  start_place: z.string(),
  end_place: z.string(),
  schedule_date: z.coerce.date(),
});
