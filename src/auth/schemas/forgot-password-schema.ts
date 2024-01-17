import * as z from "zod";

const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});

export default ForgotPasswordSchema;
