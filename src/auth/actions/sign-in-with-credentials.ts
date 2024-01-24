"use server";

import * as z from "zod";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";

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
  success?: string;
  errors?: z.ZodIssue[];
  twoFactor?: boolean;
};

export type FormValues = z.infer<typeof SignInSchema>;

export default async function signInWithCredentials(
  formValues: FormValues,
  redirectTo: string = DEFAULT_SIGN_IN_REDIRECT,
): Promise<ActionResponse> {
  const validationResult = SignInSchema.safeParse(formValues);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.errors,
    };
  }

  const { email, password, code } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      errors: [
        {
          code: "custom",
          path: ["root"],
          message: "Invalid credentials",
        },
      ],
    };
  }

  const passwordsMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordsMatch) {
    return {
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

    return { success: "Confirmation email sent" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return {
          twoFactor: true,
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

      return { success: "2FA code sent", twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
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

  redirect(redirectTo);
}
