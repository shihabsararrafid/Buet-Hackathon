import z from "zod";
// Helper function to check if date is in future
const isFutureDate = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

// Helper function to check if time is between 00:00 and 23:59
const isValidTime = (date: Date) => {
  const hours = date.getHours();
  return hours >= 0 && hours <= 23;
};
export const TicketSchema = z.object({
  owner_id: z
    .string({
      required_error: "Owner ID is required",
      invalid_type_error: "Owner ID must be a string",
    })
    .uuid({
      message: "Invalid owner ID format",
    }),

  schedule_date: z
    .date({
      required_error: "Schedule date is required",
      invalid_type_error: "Schedule date must be a valid date",
    })
    .refine(isFutureDate, {
      message: "Schedule date must be in the future",
    })
    .refine(isValidTime, {
      message: "Schedule time must be between 00:00 and 23:59",
    }),

  purchased_at: z
    .date({
      required_error: "Purchase date is required",
      invalid_type_error: "Purchase date must be a valid date",
    })
    .default(() => new Date()),

  start_place: z
    .string({
      required_error: "Start place is required",
      invalid_type_error: "Start place must be a string",
    })
    .min(2, {
      message: "Start place must be at least 2 characters",
    })
    .max(100, {
      message: "Start place must not exceed 100 characters",
    })
    .trim(),

  end_place: z
    .string({
      required_error: "End place is required",
      invalid_type_error: "End place must be a string",
    })
    .min(2, {
      message: "End place must be at least 2 characters",
    })
    .max(100, {
      message: "End place must not exceed 100 characters",
    })
    .trim(),

  trainId: z.string({
    required_error: "Train ID is required",
    invalid_type_error: "Train ID must be a string",
  }),

  seat_no: z
    .number({
      required_error: "Seat number is required",
      invalid_type_error: "Seat number must be a number",
    })
    .int({
      message: "Seat number must be an integer",
    })
    .positive({
      message: "Seat number must be positive",
    }),
});
