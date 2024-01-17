import * as z from "zod";

const ResetPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export default ResetPasswordSchema;
