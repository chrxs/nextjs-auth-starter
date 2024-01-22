"use server";

import * as z from "zod";
import { AuthError } from "next-auth";

import db from "@/lib/db";
import { signIn } from "../auth";
import { DEFAULT_SIGN_IN_REDIRECT } from "../config";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/auth/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/auth/mail";
import { SignInSchema } from "@/auth/schemas";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";

export type ActionResponse = {
  status: "success" | "error";
  message?: string;
  errors?: z.ZodIssue[];
  twoFactor?: true;
};

export type FormValues = z.infer<typeof SignInSchema>;

export default async function signInWithCredentials(
  formValues: FormValues,
  redirectTo: string = DEFAULT_SIGN_IN_REDIRECT,
): Promise<ActionResponse> {
  const validationResult = SignInSchema.safeParse(formValues);

  if (!validationResult.success) {
    return {
      status: "error",
      message: "Invalid fields!",
      errors: validationResult.error.errors,
    };
  }

  const { email, password, code } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      status: "error",
      message: "Invalid credentials",
      errors: [
        {
          code: "custom",
          path: ["root"],
          message: "Invalid credentials",
        },
      ],
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email,
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

    return { status: "success", message: "Confirmation email sent!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return {
          status: "error",
          errors: [
            {
              code: "custom",
              path: ["root"],
              message: "Invalid code",
            },
          ],
        };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return {
          status: "error",
          errors: [
            {
              code: "custom",
              path: ["root"],
              message: "Code expired",
            },
          ],
        };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id,
      );

      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { status: "success", twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            status: "error",
            message: "Invalid credentials",
            errors: [
              {
                code: "custom",
                path: ["root"],
                message: "Invalid credentials",
              },
            ],
          };

        default:
          return {
            status: "error",
            message: "Something went wrong",
            errors: [
              {
                code: "custom",
                path: ["root"],
                message: "Something went wrong",
              },
            ],
          };
      }
    }

    throw error;
  }

  return {
    status: "success",
  };
}
